# Expo Go での実行に関する重要な注意事項

## react-native-maps について

**重要**: `react-native-maps` は Expo Go アプリでは動作しません。マップ機能を使用するには、以下のいずれかの方法が必要です。

### オプション1: Development Build を使用（推奨）

Development Build を作成すると、ネイティブモジュールを含むカスタムビルドで開発できます。

```bash
# EAS CLI をインストール
npm install -g eas-cli

# EAS にログイン
eas login

# Development Build を作成
eas build --profile development --platform ios
# または Android の場合
eas build --profile development --platform android
```

ビルドが完了したら、デバイスにインストールして実行できます。

### オプション2: react-native-web-maps を使用（Web のみ）

Web ブラウザでテストする場合は、代替ライブラリを使用できます。

```bash
npm install react-native-web-maps
```

### オプション3: エミュレーター/シミュレーターを使用

ローカルの iOS シミュレーターまたは Android エミュレーターを使用する場合：

1. **iOS Simulator (macOS のみ)**
   ```bash
   npm run ios
   ```
   これにより、Development Build が自動的に作成され、シミュレーターで実行されます。

2. **Android Emulator**
   ```bash
   npm run android
   ```
   これにより、Development Build が自動的に作成され、エミュレーターで実行されます。

## 現在のエラーの解決方法

出力されたエラー:
```
ERROR [runtime not ready]: Invariant Violation: TurboModuleRegistry.getEnforcing(...): 
'RNMapsAirModule' could not be found.
```

これは、Expo Go が react-native-maps のネイティブモジュールをサポートしていないためです。

### すぐに動作確認したい場合

マップ機能なしでアプリの他の部分（ログイン画面など）を確認するには：

1. `mobile/src/navigation/AppNavigator.tsx` を一時的に編集
2. MapScreen の代わりに簡易画面を使用

または、以下のコマンドでローカルビルドを実行してください：

```bash
cd mobile

# iOS の場合（macOS のみ）
npx expo run:ios

# Android の場合
npx expo run:android
```

## Firebase Auth の警告について

AsyncStorage は既に追加されているので、この警告は次回の起動時に消えます。

## まとめ

| 方法 | マップ動作 | セットアップ時間 |
|------|-----------|----------------|
| Expo Go | ❌ 動作しない | すぐ |
| Development Build | ✅ 動作する | 10-20分 |
| ローカルビルド (run:ios/android) | ✅ 動作する | 5-10分 |
| Web (react-native-web-maps) | ✅ 動作する | 5分 |

**推奨**: まずは `npx expo run:ios` または `npx expo run:android` を試してください。これが最も簡単な方法です。
