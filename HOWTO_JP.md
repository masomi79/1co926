# アプリの起動方法（日本語ガイド）

このガイドでは、作成したモバイルアプリの起動方法を説明します。

## ⚠️ 重要な注意事項

**react-native-maps は Expo Go では動作しません。** マップ機能を使用するには、ローカルビルドまたは Development Build が必要です。

詳細は [EXPO_GO_NOTES_JP.md](./EXPO_GO_NOTES_JP.md) を参照してください。

## 必要なもの

- Node.js がインストールされていること（v18以降）
- Firebase プロジェクト
- **推奨**: iOS シミュレーター（macOS のみ）または Android エミュレーター
- （オプション）スマートフォン + Expo Go アプリ（マップ機能は使用不可）

## 手順1: 依存関係のインストール

ターミナルを開いて、以下のコマンドを実行してください：

```bash
cd mobile
npm install
```

これでアプリに必要なパッケージがインストールされます。

## 手順2: Firebase の設定

### 2-1. Firebase コンソールでプロジェクトの設定を取得

1. [Firebase Console](https://console.firebase.google.com) を開く
2. プロジェクト `my-test-project-85b1b` を選択（または新規作成）
3. ⚙️（歯車アイコン）→ プロジェクトの設定 をクリック
4. 下にスクロールして「マイアプリ」セクションを探す
5. 「アプリを追加」→ Web (</>) アイコンをクリック
6. 表示される設定オブジェクトをコピー

### 2-2. アプリに設定を追加

`mobile/src/constants/config.ts` ファイルを開いて、以下の部分を編集してください：

```typescript
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",              // ← ここに Firebase から取得した値を貼り付け
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 手順3: Firebase サービスの有効化

### Authentication（認証）を有効にする

1. Firebase Console で「Authentication」を開く
2. 「Sign-in method」タブをクリック
3. 「メール/パスワード」を選択して有効にする
4. 「保存」をクリック

### Firestore（データベース）を有効にする

1. Firebase Console で「Firestore Database」を開く
2. 「データベースの作成」をクリック
3. 「本番環境モード」を選択
4. ロケーションを選択（asia-northeast1 推奨）
5. 「有効にする」をクリック

### セキュリティルールをデプロイ（任意）

リポジトリルートにある `firestore.rules` ファイルの内容を、Firebase Console の「ルール」タブにコピー＆ペーストして「公開」をクリックしてください。

## 手順4: テストユーザーの作成

Firebase Console で：

1. 「Authentication」→「Users」タブを開く
2. 「ユーザーを追加」をクリック
3. メールアドレスとパスワードを入力
4. 「ユーザーを追加」をクリック

例：
- メール: `test@example.com`
- パスワード: `password123`

## 手順5: アプリの起動

### 方法A: ローカルビルドで実行（推奨 - マップ機能が使える）

`mobile` ディレクトリで、以下のコマンドを実行：

```bash
# iOS の場合（macOS のみ）
npx expo run:ios

# Android の場合
npx expo run:android
```

このコマンドは：
- 必要なネイティブコードをビルド
- シミュレーター/エミュレーターを起動
- アプリをインストールして実行

初回は5-10分かかりますが、マップ機能が正常に動作します。

### 方法B: Expo Go で実行（マップ機能は使えません）

⚠️ **注意**: この方法ではマップ画面でエラーが発生します。ログイン画面のテストのみ可能です。

```bash
npm start
```

すると、QRコードが表示されます。

#### スマートフォンで実行する場合：

1. スマートフォンに「Expo Go」アプリをインストール
   - iOS: App Store から
   - Android: Google Play から
2. Expo Go アプリを開く
3. 表示された QR コードをスキャン
4. アプリが起動します（マップ画面でエラーが出ます）

#### エミュレーター/シミュレーターで実行する場合：

- iOS シミュレーター（macOS のみ）: キーボードで `i` を押す
- Android エミュレーター: キーボードで `a` を押す

## 手順6: アプリを使ってみる

1. **ログイン画面**
   - 手順4で作成したメールアドレスとパスワードを入力
   - 「Sign In」ボタンをタップ
   - マップ画面に遷移します

2. **マップ画面**（ローカルビルドで実行した場合のみ）
   - Firestore に保存されている場所がマーカーで表示されます
   - マーカーをタップすると詳細が見られます

3. **訪問記録**
   - 場所の詳細画面で「Record Visit」ボタンをタップ
   - 結果を選択（Wal Aisan など）
   - 訪問記録が Firestore に保存されます ✅

## 位置データのインポート（オプション）

KMZ ファイルから位置データをインポートする場合：

```bash
# リポジトリのルートディレクトリで
node scripts/kmz_to_geojson.js path/to/Territorio.kmz > output.geojson
node scripts/import_geojson_to_firestore.js serviceAccount.json your-project-id output.geojson
```

serviceAccount.json の取得方法：
1. Firebase Console → プロジェクトの設定 → サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. `serviceAccount.json` として保存（絶対に Git にコミットしないでください！）

## トラブルシューティング

### 「Firebase not initialized」エラー

- `mobile/src/constants/config.ts` の設定を確認
- プロジェクト ID が正しいか確認

### 「No locations found」（位置が見つかりません）

- スクリプトを使ってデータをインポート
- または Firebase Console → Firestore → ドキュメントを作成 で手動追加

### ビルドエラーが出る場合

```bash
cd mobile
npx expo start -c  # キャッシュをクリア
rm -rf node_modules && npm install  # 再インストール
```

### マップが表示されない

- 位置情報の許可を確認
- Android の場合、Google Play Services がインストールされているか確認

## プロジェクトの構造

```
mobile/
├── src/
│   ├── screens/          → ログイン、マップ、詳細画面
│   ├── services/         → Firebase 連携処理
│   ├── components/       → 再利用可能な UI コンポーネント
│   ├── constants/        → 設定ファイル（Firebase の設定はここ）
│   └── types/            → TypeScript の型定義
└── App.tsx              → アプリのエントリーポイント
```

## 詳しい情報

- 英語版 README: `mobile/README.md`
- 詳細なセットアップガイド: `mobile/SETUP_GUIDE.md`
- クイックスタート: `QUICKSTART.md`

---

**所要時間: 約5〜10分** ⏱️

**難易度: 簡単** ⭐

**結果: 動作する MVP アプリ** ✅

何か問題があればお気軽にお聞きください！
