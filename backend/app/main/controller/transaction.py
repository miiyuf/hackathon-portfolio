# Modify existing code

def get_transactions():
    # ...既存のコード...
    
    results = cursor.fetchall()
    
    # 日付データを文字列に変換
    for row in results:
        if row.get('created_at'):
            row['created_at'] = row['created_at'].isoformat()
    
    cursor.close()
    conn.close()
    
    return jsonify(results)