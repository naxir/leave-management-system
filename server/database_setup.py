from sqlalchemy import Column, ForeignKey, Integer, String, Text, Date, Numeric, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, sessionmaker
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context
import random
import string
from itsdangerous import(
    TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

Base = declarative_base()

secret_key = ''.join(random.choice(
    string.ascii_uppercase + string.digits) for x in xrange(32))


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


'''class Leavebalance(Base):
    __tablename__ = 'leavebalance'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    annual = Column(Numeric)
    sick = Column(Numeric)
    bereavement = Column(Numeric)
    christmas = Column(Numeric)
    maternity = Column(Numeric)
    user = relationship(
        User, backref=backref("leavebalance", cascade="all, delete-orphan"))
    user_id = Column(Integer, ForeignKey('user.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'annual': self.annual,
            'sick': self.sick,
            'bereavement': self.bereavement,
            'christmas': self.christmas,
            'maternity': self.maternity,
            'user_id': self.user_id,
        }'''


class Leaverecord(Base):
    __tablename__ = 'leaverecord'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    leave_name = Column(String)
    leave_type = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    leave_days = Column(String)
    leave_reason = Column(String)
    leave_status = Column(String)
    date_posted = Column(String)
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
            'date_reviewed': self.date_reviewed,
            'declined_reason': self.declined_reason,
            'file_name': self.file_name,
            'user_id': self.user_id
        }

''' admin db '''
admin_secret_key = ''.join(random.choice(
    string.ascii_uppercase + string.digits) for x in xrange(32))


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


class Publicholiday(Base):
    __tablename__ = 'publicholiday'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    holiday_date = Column(Date)

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'holiday_date': self.holiday_date
        }

engine = create_engine('postgresql:///leavedb')

Base.metadata.create_all(engine)