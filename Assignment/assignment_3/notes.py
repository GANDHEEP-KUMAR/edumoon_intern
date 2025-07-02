import os
from cryptography.fernet import Fernet
from datetime import datetime

KEY_FILE = os.path.join(os.path.dirname(__file__), 'secret.key')
NOTES_FILE = os.path.join(os.path.dirname(__file__), 'notes.txt')

def generate_key():
    key = Fernet.generate_key()
    with open(KEY_FILE, 'wb') as key_file:
        key_file.write(key)
    return key

def load_key():
    if not os.path.exists(KEY_FILE):
        return generate_key()
    with open(KEY_FILE, 'rb') as key_file:
        return key_file.read()

def encrypt_note(note, fernet):
    return fernet.encrypt(note.encode())

def decrypt_note(token, fernet):
    return fernet.decrypt(token).decode()

def write_note():
    key = load_key()
    fernet = Fernet(key)
    note = input("Enter your note: ")
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    encrypted = encrypt_note(f"[{timestamp}] {note}", fernet)
    with open(NOTES_FILE, 'ab') as f:
        f.write(encrypted + b'\n')
    print("Note saved and encrypted.")

def read_notes():
    key = load_key()
    fernet = Fernet(key)
    if not os.path.exists(NOTES_FILE):
        print("No notes found.")
        return
    with open(NOTES_FILE, 'rb') as f:
        for line in f:
            try:
                print(decrypt_note(line.strip(), fernet))
            except Exception:
                print("[Could not decrypt a note]")

def main():
    print("Encrypted Notes CLI App")
    print("1. Write a note")
    print("2. Read notes")
    choice = input("Choose an option (1/2): ")
    if choice == '1':
        write_note()
    elif choice == '2':
        read_notes()
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()
