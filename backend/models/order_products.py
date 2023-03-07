from db import db
from sqlalchemy import inspect


class OrderProductModel(db.Model):
    __tablename__ = "orders_products"

    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float(precision=2), unique=False, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    id_product = db.Column(db.Integer, db.ForeignKey("products.id"))
    id_order = db.Column(db.Integer, db.ForeignKey("orders.id"))

    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }