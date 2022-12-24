const fs = require("node:fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve(__dirname, "./db/contacts.json");

async function readContactsFromDB() {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    return JSON.parse(contactsBuffer);
  } catch (err) {
    console.error(err);
  }
}

async function writeContactsToDB(contactsArr) {
  try {
    const contactsRow = JSON.stringify(contactsArr, null, 2);
    await fs.writeFile(contactsPath, contactsRow);
  } catch (err) {
    console.error(err);
  }
}

async function listContacts() {
  const contacts = await readContactsFromDB();
  console.table(contacts);
  return contacts;
}

async function getContactById(contactId) {
  try {
    const contacts = await readContactsFromDB();
    const askedContact = contacts.find(({ id }) => id === contactId.toString());
    if (!askedContact) {
      throw new Error("Contact not found");
    }
    console.table(askedContact);
    return askedContact;
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContactsFromDB();
    const updatedContacts = await contacts.filter(
      ({ id }) => id !== contactId.toString()
    );
    console.log(`Contact with id: ${contactId} successfully removed`);
    await writeContactsToDB(updatedContacts);
    console.table(updatedContacts);
    return updatedContacts;
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = { name, email, phone, id: nanoid() };
    const contacts = await readContactsFromDB();
    await contacts.push(newContact);

    console.log(`New contact ${name} successfully added`);
    await writeContactsToDB(contacts);
    console.table(contacts);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
