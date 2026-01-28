import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert, Platform, Modal, ScrollView, useColorScheme, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Slider from '@react-native-community/slider';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Standard in Expo
import i18n from './i18n';

// --- THEME CONFIG ---
const THEMES = {
  light: {
    bg: '#f5f7fa',
    text: '#2d3748',
    subText: '#718096',
    cardBg: '#fff',
    border: '#e2e8f0',
    navBg: 'rgba(255,255,255,0.9)',
    tint: '#4e54c8',
    tintText: '#fff',
    danger: '#e53e3e',
  },
  dark: {
    bg: '#1a202c',
    text: '#f7fafc',
    subText: '#cbd5e0',
    cardBg: '#2d3748',
    border: '#4a5568',
    navBg: 'rgba(26,32,44,0.9)',
    tint: '#805ad5', // Lighter purple for dark mode
    tintText: '#fff',
    danger: '#fc8181',
  }
};

// Helper to format file size
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function App() {
  // --- STATE ---
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewUris, setPreviewUris] = useState<Record<string, string>>({});
  const [compression, setCompression] = useState(0.9);
  const [imageSizes, setImageSizes] = useState({ original: 0, preview: 0 });
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Settings State
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');
  const [locale, setLocale] = useState(i18n.locale); // Ensure initial value matches i18n
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Derived Theme
  const activeTheme = themeMode === 'system' ? (systemColorScheme || 'light') : themeMode;
  const colors = THEMES[activeTheme];

  // Update i18n when locale changes
  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await requestPermission();
        await clearCache(); // Startup cleanup
      }
    })();
  }, []);

  const clearCache = async () => {
    try {
      if (!FileSystem.cacheDirectory) return;
      const cacheDir = FileSystem.cacheDirectory + 'ImageManipulator';
      const info = await FileSystem.getInfoAsync(cacheDir);
      if (info.exists && info.isDirectory) {
        await FileSystem.deleteAsync(cacheDir, { idempotent: true });
        // Re-create ensures subsequent operations don't fail immediately
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }
    } catch (e) {
      console.warn("Failed to clear cache:", e);
    }
  };

  const getFileSize = async (uri: string) => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        return info.size;
      }
    } catch (e) {
      console.warn("FileSystem failed, trying fallback:", e);
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob.size;
      } catch (e2) {
        console.error("Fallback file size failed:", e2);
      }
    }
    return 0;
  };

  const processImage = async (uri: string, qual: number) => {
    try {
      setProcessing(true);
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG, compress: qual }
      );
      const size = await getFileSize(result.uri);

      setPreviewUris(prev => ({ ...prev, [uri]: result.uri }));
      setImageSizes(prev => ({ ...prev, preview: size }));
      setProcessing(false);
      return result.uri;
    } catch (e) {
      console.error("Processing failed", e);
      Alert.alert(i18n.t('errorTitle'), i18n.t('processError'));
      setProcessing(false);
      return null;
    }
  };

  // Re-process when current image or compression changes
  useEffect(() => {
    const currentAsset = selectedImages[currentIndex];
    if (currentAsset) {
      const updateOriginalSize = async () => {
        let originalSize = 0;
        if (currentAsset.fileSize) {
          originalSize = currentAsset.fileSize;
        } else {
          originalSize = await getFileSize(currentAsset.uri);
        }
        setImageSizes(prev => ({ ...prev, original: originalSize, preview: 0 }));
        await processImage(currentAsset.uri, compression);
      };
      updateOriginalSize();
    }
  }, [currentIndex, selectedImages, compression]);

  const pickImage = async () => {
    setStatus('idle');
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        exif: true,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (!result.canceled) {
        setSelectedImages(result.assets);
        setCurrentIndex(0);
        setPreviewUris({});
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(i18n.t('errorTitle'), i18n.t('pickError'));
    }
  };

  const handleCompressionChange = (value: number) => {
    setCompression(value);
  };

  const handleNext = () => {
    if (currentIndex < selectedImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSaveAllToGallery = async () => {
    if (selectedImages.length === 0) return;

    if (permissionResponse?.status !== 'granted') {
      const response = await requestPermission();
      if (response.status !== 'granted') {
        Alert.alert(i18n.t('permissionNeeded'), i18n.t('permissionMsg'));
        return;
      }
    }

    try {
      setProcessing(true);
      setStatus('processing');

      let savedCount = 0;
      for (const asset of selectedImages) {
        let uriToSave = previewUris[asset.uri];
        // Re-process to ensure consistency
        const result = await ImageManipulator.manipulateAsync(
          asset.uri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG, compress: compression }
        );
        uriToSave = result.uri;
        await MediaLibrary.saveToLibraryAsync(uriToSave);
        savedCount++;
      }

      setStatus('success');
      Alert.alert(i18n.t('successTitle'), i18n.t('successAllMsg', { count: savedCount }));
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert(i18n.t('errorTitle'), i18n.t('saveError'));
      setStatus('idle');
    } finally {
      setProcessing(false);
    }
  };

  const handleShareCurrent = async () => {
    const currentAsset = selectedImages[currentIndex];
    if (!currentAsset) return;

    const cleanUri = previewUris[currentAsset.uri];
    if (!cleanUri) return;

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(cleanUri, {
          mimeType: 'image/jpeg',
          dialogTitle: i18n.t('shareCurrent')
        });
        setStatus('success');
      } else {
        Alert.alert(i18n.t('errorTitle'), i18n.t('shareUnavailable'));
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert(i18n.t('errorTitle'), i18n.t('shareError'));
    }
  };

  const handleDonate = () => {
    const address = "9vCKCmshK75XnJjfFvgjsaK7Yv4GmwJVHoQnTuGj9psw";
    // Removing parameters to ensure compatibility with all wallets (Phantom, Backpack, etc.)
    const url = `solana:${address}`;
    Linking.openURL(url).catch(err => {
      console.error("Donate error:", err);
      // Fallback if no wallet is found
      Alert.alert(i18n.t('errorTitle'), "No wallet app found.\nPlease donate to: " + address.slice(0, 8) + "...");
    });
  };

  const handleReset = () => {
    Alert.alert(
      i18n.t('resetTitle'),
      i18n.t('resetConfirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('reset'),
          style: 'destructive',
          onPress: async () => {
            setSelectedImages([]);
            setCurrentIndex(0);
            setPreviewUris({});
            setImageSizes({ original: 0, preview: 0 });
            setStatus('idle');
            await clearCache();
          }
        }
      ]
    );
  };

  const handleManualClearCache = async () => {
    Alert.alert(
      i18n.t('clearCache'),
      i18n.t('cacheClearConfirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            await clearCache();
            Alert.alert(i18n.t('successTitle'), i18n.t('cacheCleared'));
          }
        }
      ]
    );
  };

  const handlePrivacyPolicy = async () => {
    // Linked to the raw markdown file in the repo based on locale
    const repoBase = 'https://github.com/codex-9990/exif-cleaner-for-Seeker/blob/main/';
    let filename = 'PRIVACY_POLICY.md'; // Default English

    const currentLocale = i18n.locale.split('-')[0]; // simple check for 'ja', 'fr', etc.
    const fullLocale = i18n.locale; // for 'zh-TW', 'zh-CN'

    if (fullLocale === 'zh-TW' || fullLocale === 'zh-Hant') {
      filename = 'PRIVACY_POLICY_TW.md';
    } else if (fullLocale === 'zh-CN' || fullLocale === 'zh-Hans') {
      filename = 'PRIVACY_POLICY_CN.md';
    } else {
      switch (currentLocale) {
        case 'ja': filename = 'PRIVACY_POLICY_JA.md'; break;
        case 'fr': filename = 'PRIVACY_POLICY_FR.md'; break;
        case 'de': filename = 'PRIVACY_POLICY_DE.md'; break;
        case 'it': filename = 'PRIVACY_POLICY_IT.md'; break;
        case 'es': filename = 'PRIVACY_POLICY_ES.md'; break;
        case 'ko': filename = 'PRIVACY_POLICY_KO.md'; break;
        case 'ar': filename = 'PRIVACY_POLICY_AR.md'; break;
      }
    }

    const url = repoBase + filename;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(i18n.t('errorTitle'), "Cannot open link: " + url);
      }
    } catch (err) {
      console.error("Link Error:", err);
      Alert.alert(i18n.t('errorTitle'), "Failed to open Privacy Policy link.");
    }
  };

  // --- RENDER HELPERS ---
  const renderLanguageOption = (langCode: string, label: string) => (
    <TouchableOpacity
      key={langCode}
      style={[
        styles.settingOption,
        locale.startsWith(langCode) && { backgroundColor: colors.tint }
      ]}
      onPress={() => {
        i18n.locale = langCode;
        setLocale(langCode);
        setIsSettingsOpen(false);
      }}
    >
      <Text style={[styles.settingText, { color: colors.text }, locale.startsWith(langCode) && { color: colors.tintText }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderThemeOption = (mode: 'system' | 'light' | 'dark', label: string) => (
    <TouchableOpacity
      style={[
        styles.settingOption,
        themeMode === mode && { backgroundColor: colors.tint }
      ]}
      onPress={() => setThemeMode(mode)}
    >
      <Text style={[styles.settingText, { color: colors.text }, themeMode === mode && { color: colors.tintText }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );



  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />

      {/* HEADER - Fixed at top */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{i18n.t('title')}</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]} numberOfLines={2} adjustsFontSizeToFit>{i18n.t('subtitle')}</Text>
        </View>
        <TouchableOpacity onPress={() => setIsSettingsOpen(true)} style={styles.settingsButton}>
          <Ionicons name="settings-sharp" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ paddingBottom: 100, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE CARD */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {selectedImages.length > 0 ? (
            <>
              <Image
                source={{ uri: previewUris[selectedImages[currentIndex]?.uri] || selectedImages[currentIndex]?.uri }}
                style={styles.previewImage}
                resizeMode="contain"
              />

              {/* Nav */}
              {selectedImages.length > 1 && (
                <View style={[styles.navContainer, { backgroundColor: colors.navBg }]}>
                  <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0} style={[styles.navButton, { borderColor: colors.border, backgroundColor: colors.bg }, currentIndex === 0 && styles.disabledNav]}>
                    <Text style={[styles.navText, { color: colors.text }]}>&lt;</Text>
                  </TouchableOpacity>
                  <View style={styles.navBadge}>
                    <Text style={[styles.navBadgeText, { color: colors.text }]}>{currentIndex + 1} / {selectedImages.length}</Text>
                  </View>
                  <TouchableOpacity onPress={handleNext} disabled={currentIndex === selectedImages.length - 1} style={[styles.navButton, { borderColor: colors.border, backgroundColor: colors.bg }, currentIndex === selectedImages.length - 1 && styles.disabledNav]}>
                    <Text style={[styles.navText, { color: colors.text }]}>&gt;</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.placeholder}>
              <Text style={[styles.placeholderText, { color: colors.subText }]}>{i18n.t('noImage')}</Text>
            </View>
          )}
        </View>

        {/* SUCCESS MESSAGE & DONATION (Moved here) */}
        {status === 'success' && (
          <View style={{ alignItems: 'center', marginBottom: 20, width: '100%' }}>
            <Text style={styles.successText}>{i18n.t('processedSuccess')}</Text>
            <TouchableOpacity
              onPress={handleDonate}
              style={{ marginTop: 12, padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderRadius: 12, borderWidth: 1, borderColor: colors.tint }}
            >
              <Ionicons name="heart" size={16} color={colors.tint} style={{ marginRight: 6 }} />
              <Text style={{ color: colors.tint, fontSize: 14, fontWeight: '600' }}>
                {i18n.t('donate')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* INFO & CONTROLS */}
        {selectedImages.length > 0 && (
          <View style={[styles.infoContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.sizeRow}>
              <Text style={[styles.sizeLabel, { color: colors.subText }]}>{i18n.t('original')}: {formatSize(imageSizes.original)}</Text>
              <Text style={[styles.arrowText, { color: colors.subText }]}>→</Text>
              <Text style={[styles.sizeLabel, styles.previewSizeLabel, { color: colors.text }]}>
                {i18n.t('preview')}: {imageSizes.preview > 0 ? formatSize(imageSizes.preview) : i18n.t('calculating')}
              </Text>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderLabel, { color: colors.text }]}>{i18n.t('quality')}: {Math.round(compression * 100)}%</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={compression}
                onSlidingComplete={handleCompressionChange}
                minimumTrackTintColor={colors.tint}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.tint}
              />
            </View>
          </View>
        )}

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>
          {selectedImages.length > 0 ? (
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.button, styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={pickImage} disabled={processing}>
                <Text style={[styles.buttonText, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{i18n.t('reselectImages')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { width: 60, backgroundColor: colors.danger, borderColor: colors.danger }]} onPress={handleReset} disabled={processing}>
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={pickImage} disabled={processing}>
              <Text style={[styles.buttonText, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{i18n.t('selectImage')}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.button, styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }, (selectedImages.length === 0 || processing) && styles.disabledButton]}
              onPress={handleSaveAllToGallery}
              disabled={selectedImages.length === 0 || processing}
            >
              {processing && status === 'processing' ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                  {selectedImages.length > 1 ? i18n.t('saveAll') : i18n.t('saveToGallery')}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.actionButton, { backgroundColor: colors.tint, borderColor: colors.tint }, (selectedImages.length === 0 || processing) && styles.disabledButton]}
              onPress={handleShareCurrent}
              disabled={selectedImages.length === 0 || processing}
            >
              <Text style={[styles.buttonText, { color: colors.tintText }]} numberOfLines={1} adjustsFontSizeToFit>
                {selectedImages.length > 1 ? i18n.t('shareCurrent') : i18n.t('shareFile')}
              </Text>
            </TouchableOpacity>
          </View>
          {selectedImages.length > 1 && (
            <Text style={[styles.noteText, { color: colors.subText }]}>{i18n.t('shareNote')}</Text>
          )}
        </View>

        {/* Donate Button on Main Screen */}
        <TouchableOpacity
          style={[styles.donateButton, { borderColor: colors.border, marginBottom: 20 }]}
          onPress={handleDonate}
        >
          <Ionicons name="heart-outline" size={16} color={colors.subText} style={{ marginRight: 6 }} />
          <Text style={[styles.donateButtonText, { color: colors.subText }]}>{i18n.t('donate')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SETTINGS MODAL */}
      <Modal
        visible={isSettingsOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.bg }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Settings</Text>
            <TouchableOpacity onPress={() => setIsSettingsOpen(false)}>
              <Text style={{ color: colors.tint, fontSize: 16, fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>

            {/* Theme Section */}
            <Text style={[styles.sectionTitle, { color: colors.subText }]}>Theme</Text>
            <View style={[styles.optionsContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {renderThemeOption('system', 'System Default')}
              {renderThemeOption('light', 'Light Mode')}
              {renderThemeOption('dark', 'Dark Mode')}
            </View>

            {/* Language Section */}
            <Text style={[styles.sectionTitle, { color: colors.subText, marginTop: 24 }]}>Language</Text>
            <View style={[styles.optionsContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {renderLanguageOption('en', 'English')}
              {renderLanguageOption('ja', '日本語')}
              {renderLanguageOption('fr', 'Français')}
              {renderLanguageOption('de', 'Deutsch')}
              {renderLanguageOption('it', 'Italiano')}
              {renderLanguageOption('es', 'Español')}
              {renderLanguageOption('zh-CN', '简体中文')}
              {renderLanguageOption('zh-TW', '繁體中文')}
              {renderLanguageOption('ko', '한국어')}
              {renderLanguageOption('ar', 'العربية')}
            </View>

            {/* Cache Section */}
            <Text style={[styles.sectionTitle, { color: colors.subText, marginTop: 24 }]}>Cache</Text>
            <View style={[styles.optionsContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.settingOption, { backgroundColor: colors.cardBg }]}
                onPress={handleManualClearCache}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="trash-bin-outline" size={20} color={colors.danger} style={{ marginRight: 8 }} />
                  <Text style={[styles.settingText, { color: colors.danger }]}>
                    {i18n.t('clearCache')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Donation Section */}
            <Text style={[styles.sectionTitle, { color: colors.subText, marginTop: 24 }]}>{i18n.t('donateTitle')}</Text>
            <View style={[styles.optionsContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.settingOption, { backgroundColor: colors.tint }]}
                onPress={handleDonate}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="heart" size={20} color={colors.tintText} style={{ marginRight: 8 }} />
                  <Text style={[styles.settingText, { color: colors.tintText, fontWeight: '700' }]}>
                    {i18n.t('donate')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Privacy Policy Section */}
            <Text style={[styles.sectionTitle, { color: colors.subText, marginTop: 24 }]}>About</Text>
            <View style={[styles.optionsContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.settingOption, { backgroundColor: colors.cardBg }]}
                onPress={handlePrivacyPolicy}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} style={{ marginRight: 8 }} />
                  <Text style={[styles.settingText, { color: colors.text }]}>
                    {i18n.t('privacyPolicy')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Version Info */}
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text style={{ color: colors.subText, fontSize: 12 }}>v1.0.0</Text>
            </View>

          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center', // Removed to allow scrolling
    padding: 20,
    paddingTop: 60,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  settingsButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    width: '100%',
    aspectRatio: 1, // Square preview
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrowText: {
    marginHorizontal: 10,
  },
  previewSizeLabel: {
    fontWeight: '700',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  successText: {
    marginTop: 20,
    color: '#48bb78',
    fontSize: 16,
    fontWeight: '600',
  },
  navContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  disabledNav: {
    opacity: 0.3,
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBadge: {
    paddingHorizontal: 12,
  },
  navBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noteText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  optionsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingOption: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  donateButtonText: {
    fontSize: 13,
    fontWeight: '500',
  }
});
