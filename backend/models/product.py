from db import db


class ProductModel(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    price = db.Column(db.Float(precision=2), unique=False, nullable=False)
    score = db.Column(db.Integer)
    image = db.Column(db.String(256), nullable=False)