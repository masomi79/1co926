# Firestore スキーマ（1co926）

プロジェクト: my-test-project-85b1b

この文書は 1co926 の Firestore データモデル仕様をまとめたものです。開発・運用に際して参照してください。

## 概要
- 認証: Firebase Authentication（メール/パスワード）
- データベース: Cloud Firestore
- 主コレクション:
  - locations — 表示する訪問地点（KMZ→GeoJSON からインポート）
  - visits — 各ユーザーの訪問記録（1 回の訪問は 1 レコード）
  - users — ユーザープロファイル（任意）

## コレクション: locations
ドキュメントID: 可能であればインポート元の ID を用いる（重複管理が楽になる）

フィールド例:
- id: string (オプション、インポート元のIDを冗長に保管)
- name: string (必須)
- description: string (optional)
- lat: number (必須)
- lng: number (必須)
- category: string (任意)
- source: string (例: "imported" | "manual")
- createdBy: string (uid, 任意)
- createdAt: timestamp
- properties: map/object (元の GeoJSON プロパティなど)

インデックス:
- 位置検索は基本的にクライアントサイドでジオクエリを行うことを想定（軽量のため簡単な近傍検索を利用）。
- 将来的に位置ベース検索を Firestore の索引で高速化する場合、geo-library の利用や外部インデックス検討。

## コレクション: visits
ドキュメントID: 自動生成（履歴保持のため自動ID推奨）

必須フィールド:
- userId: string (uid) — 作成者の uid（必須）
- locationId: string — 対応する locations ドキュメントの ID（必須）
- result: string (enum) — 訪問結果。下記 enum のいずれか（必須）
- timestamp: timestamp — 訪問時刻（必須）
- createdAt: timestamp (serverTimestamp() 推奨)

任意フィールド:
- note: string (短いメモ)
- photoUrl: string (Storage にアップした場合のダウンロード URL)

result enum 値（本仕様で確定）:
- "Wal_Aisan"
- "Upla_Apu"
- "Kli_Wabia"
- "Upla_Iwras"

仕様:
- 1 回の訪問は 1 レコード（同一ユーザーが同地点を複数回訪問した場合は複数の visits を作成）。
- userId は必ず request.auth.uid と一致させる（クライアント改竄防止）。

## コレクション: users (optional)
ドキュメントID = uid

例フィールド:
- displayName: string
- email: string
- role: string ("user" | "admin") — 参照用。運用上は custom claim で admin を付与する。
- createdAt: timestamp

## ルールの概略（詳細は firestore.rules を参照）
- locations: 読み取りは認証ユーザー、書き込み（作成/更新/削除）は管理者のみ
- visits: 作成は認証ユーザーで userId==auth.uid であれば可。読み取りは認証ユーザーに許可。更新・削除は管理者または作成者本人のみ
- users: 自分のドキュメントは本人が更新可。管理者は全体を操作可

## 例: ドキュメント（JSON 形式）
locations ドキュメント例:
```json
{
  "id": "loc-001",
  "name": "Sample Place",
  "description": "説明",
  "lat": 35.6895,
  "lng": 139.6917,
  "category": "office",
  "source": "imported",
  "createdBy": "adminUid",
  "createdAt": "2025-12-13T12:00:00Z",
  "properties": { "raw": "..." }
}
```

visits ドキュメント例:
```json
{
  "userId": "userUid123",
  "locationId": "loc-001",
  "result": "Wal_Aisan",
  "timestamp": "2025-12-13T15:30:00Z",
  "note": "訪問済み、問題なし",
  "photoUrl": "https://storage.googleapis.com/..",
  "createdAt": "2025-12-13T15:30:02Z"
}
```

## 推奨クエリ
- ある地点の訪問履歴:
  - client: db.collection('visits').where('locationId','==', locationId).orderBy('timestamp','desc')
- ユーザーの訪問履歴:
  - client: db.collection('visits').where('userId','==', uid).orderBy('timestamp','desc')

## バックアップ / 運用
- 定期バックアップ（手動または Cloud Scheduler + Cloud Function / Cloud Run）で Firestore を GCS にエクスポート:
  ```
  gcloud firestore export gs://YOUR_BUCKET_NAME/backups/$(date +%Y%m%d) --project=my-test-project-85b1b
  ```
- 重要: export を行う GCS バケットは適切なアクセス制御を設定する。

## 注意点
- Firestore のインデックスやクエリの構成は、実データ量・アクセスパターンによって最適化が必要。
- 写真を扱う場合は Storage と rules の設定を忘れずに（Storage のルールは別途作成）。
- 管理者権限は custom claim (admin=true) で付与する運用を推奨。

## 次の作業候補
1. firestore.rules の草案作成（このリポジトリに追加済み）  
2. Expo プロジェクト scaffold（mobile/）作成と、Auth + locations 読取表示の実装  
3. visits 作成 UI（enum 選択）および Storage 写真対応（オプション）