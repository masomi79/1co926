# 1co926 (KMZ → GeoJSON / Firestore import utilities)

概要:
- KMZ（Google Earth の圧縮形式）を GeoJSON に変換するスクリプト
- GeoJSON を Firebase Firestore にインポートするスクリプト
- モバイルアプリ本体は別リポジトリ / 別フォルダで作成予定

使い方（ローカル）:
1. リポジトリをクローン or ローカルで作業ディレクトリを作成
2. 依存をインストール:
   npm install

3. KMZ → GeoJSON:
   node scripts/kmz_to_geojson.js path/to/Territorio.kmz > output.geojson

4. Firestore へインポート（管理者権限）:
   node scripts/import_geojson_to_firestore.js serviceAccount.json your-project-id output.geojson

注意:
- serviceAccount.json（Firebase 管理者キー）は安全に保管し、リポジトリにコミットしないでください。
- Firestore のコレクション名は scripts 内で `locations` にしています。必要なら変更してください。
- Node.js の LTS を使ってください（nvm を推奨）。
