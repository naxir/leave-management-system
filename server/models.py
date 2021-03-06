from sqlalchemy import Column, ForeignKey, Integer, String, Text, Date, \
    Numeric, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, sessionmaker, scoped_session
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context
import random
import string
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer,
                          BadSignature, SignatureExpired)

engine = create_engine('postgresql:///leavedb')

db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()

Base.query = db_session.query_property()

Base.metadata.create_all(engine)

secret_key = ''.join(
    random.choice(string.ascii_uppercase + string.digits) for x in range(32))


# user
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    password_hash = Column(String(128))
    surname = Column(String)
    othernames = Column(String)
    designation = Column(Text)
    gender = Column(Text)
    date_of_birth = Column(Date)
    annual = Column(Numeric)
    sick = Column(Numeric)
    bereavement = Column(Numeric)
    christmas = Column(Numeric)
    maternity = Column(Numeric)
    isArchived = Column(Boolean)
    archiveReason = Column(Text)

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=3600):
        s = Serializer(secret_key, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            # Valid Token, but expired
            return None
        except BadSignature:
            # Invalid Token
            return None
        user_id = data['id']
        return user_id

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'email': self.email,
            'surname': self.surname,
            'othernames': self.othernames,
            'designation': self.designation,
            'gender': self.gender,
            'date_of_birth': self.date_of_birth,
            'annual': self.annual,
            'sick': self.sick,
            'bereavement': self.bereavement,
            'christmas': self.christmas,
            'maternity': self.maternity,
            'date_of_birth': self.date_of_birth,
            'isArchived': self.isArchived,
            'archiveReason': self.archiveReason,
        }


# user updates
class Userupdates(Base):
    __tablename__ = 'userupdates'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    designation = Column(Text)
    gender = Column(Text)
    date_of_birth = Column(Date)
    annual = Column(Numeric)
    sick = Column(Numeric)
    bereavement = Column(Numeric)
    christmas = Column(Numeric)
    maternity = Column(Numeric)
    editReason = Column(Text)
    date_posted = Column(String)
    user = relationship(
        User, backref=backref("userupdates", cascade="all, delete-orphan"))
    user_id = Column(Integer, ForeignKey('user.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'designation': self.designation,
            'gender': self.gender,
            'date_of_birth': self.date_of_birth,
            'annual': self.annual,
            'sick': self.sick,
            'bereavement': self.bereavement,
            'christmas': self.christmas,
            'maternity': self.maternity,
            'editReason': self.archiveReason,
            'user_id': self.user_id,
            'dated_posted': self.dated_posted
        }


# leave record
class Leaverecord(Base):
    __tablename__ = 'leaverecord'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    leave_name = Column(String)
    leave_type = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    leave_days = Column(Numeric)
    leave_reason = Column(String)
    leave_status = Column(String)
    date_posted = Column(String)
    cancelled_reason = Column(String)
    date_reviewed = Column(String)
    declined_reason = Column(String)
    file_name = Column(Text, nullable=True, unique=True)
    user = relationship(
        User, backref=backref("leaverecord", cascade="all, delete-orphan"))
    user_id = Column(Integer, ForeignKey('user.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'leave_name': self.leave_name,
            'leave_type': self.leave_type,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'leave_days': self.leave_days,
            'leave_reason': self.leave_reason,
            'leave_status': self.leave_status,
            'date_posted': self.date_posted,
            'cancelled_reason': self.cancelled_reason,
            'date_reviewed': self.date_reviewed,
            'declined_reason': self.declined_reason,
            'file_name': self.file_name,
            'user_id': self.user_id
        }


# leave updates
class Leaveupdates(Base):
    __tablename__ = 'leaveupdates'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    updated_leave_name = Column(String)
    updated_leave_type = Column(String)
    updated_start_date = Column(String)
    updated_end_date = Column(String)
    updated_leave_days = Column(Numeric)
    leave_status = Column(String)
    date_posted = Column(String)
    editReason = Column(Text)
    previous_leave_days = Column(Numeric)
    previous_leave_name = Column(String)
    previous_leave_type = Column(String)
    previous_start_date = Column(String)
    previous_end_date = Column(String)
    user_id = Column(Integer)
    leaverecord = relationship(
        Leaverecord,
        backref=backref("leaveupdates", cascade="all, delete-orphan"))
    leave_id = Column(Integer, ForeignKey('leaverecord.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'updated_leave_name': self.updated_leave_name,
            'updated_leave_type': self.updated_leave_type,
            'updated_start_date': self.updated_start_date,
            'updated_end_date': self.updated_end_date,
            'updated_leave_days': self.updated_leave_days,
            'editReason': self.editReason,
            'previous_leave_days': self.previous_leave_days,
            'previous_leave_name': self.previous_leave_name,
            'previous_leave_type': self.previous_leave_type,
            'previous_start_date': self.previous_start_date,
            'previous_end_date': self.previous_end_date,
            'date_posted': self.date_posted,
            'leave_id': self.leave_id,
            'user_id': self.user_id
        }


# admin
admin_secret_key = ''.join(
    random.choice(string.ascii_uppercase + string.digits) for x in range(32))


class Adminuser(Base):
    __tablename__ = 'adminuser'
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    password_hash = Column(String(128))
    surname = Column(String)
    othernames = Column(String)

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=3600):
        s = Serializer(admin_secret_key, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(admin_secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            # Valid Token, but expired
            return None
        except BadSignature:
            # Invalid Token
            return None
        admin_id = data['id']
        return admin_id

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'email': self.email,
            'surname': self.surname,
            'othernames': self.othernames,
        }


# public holiday
class Publicholiday(Base):
    __tablename__ = 'publicholiday'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    holiday_date = Column(Date)

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {'id': self.id, 'holiday_date': self.holiday_date}
