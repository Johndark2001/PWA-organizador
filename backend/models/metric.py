from backend.extensions import db

class Metric(db.Model):
    __tablename__ = "metrics"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_sub = db.Column(db.String, index=True, nullable=False)
    date = db.Column(db.String, nullable=False)
    focused_minutes_today = db.Column(db.Integer, default=0)
    streak_days = db.Column(db.Integer, default=0)
    last_active_date = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "userSub": self.user_sub,
            "date": self.date,
            "focusedMinutesToday": self.focused_minutes_today,
            "streakDays": self.streak_days,
            "lastActiveDate": self.last_active_date,
        }
