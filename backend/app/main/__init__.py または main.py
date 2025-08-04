from flask import Flask
from decimal import Decimal

class DecimalJSONEncoder(Flask.json_encoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalJSONEncoder, self).default(obj)

app = Flask(__name__)
app.json_encoder = DecimalJSONEncoder