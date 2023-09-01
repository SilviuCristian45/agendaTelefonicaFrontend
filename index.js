const container = document.getElementById("container")
let contactsDisplayed = []

fetchContacts().then(contacts => {
    contacts.forEach(element => container.appendChild(createContactView(element)))
    contactsDisplayed = [...contacts]
    localStorage.setItem("contacts", JSON.stringify(contacts))
}).catch(err => {
    console.log(err)
    const cachedContacts = JSON.parse(localStorage.getItem("contacts"))
    if (!cachedContacts) return
    console.log(cachedContacts)
    cachedContacts.forEach(element => container.appendChild(createContactView(element)))
    contactsDisplayed = [...cachedContacts]
})

document.getElementById('addContactBtn').onclick = async () => {

    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    formData.set("Name",document.getElementById('Name').value)
    formData.set("Phone",document.getElementById('Phone').value)
    formData.set("Description", document.getElementById('Description').value)
    formData.set("imagine", document.getElementById('Image').files[0])
    
    // Check if any required field is empty
    if (!formData.get('Name') || !formData.get('Phone') || !formData.get('Description')) {
        alert('Please fill in all required fields');
        return;
    }

    const phoneNumberRegex = /^(?:(?:\+|00)40|0)(?:(?:2[1-4]|3[1-9]|4[0-9]|5[1-9]|6[1-8]|7[1-9]|8[1-9]|9[1-8])[0-9]{7})$/;

    if (!phoneNumberRegex.test(formData.get("Phone"))) {
        alert('numarul de telefon nu e corect')
        return
    }

        fetch('http://localhost:5000/addContact', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                location.reload(); // Reload the page if the request is successful
            } else {
                throw new Error('Failed to add contact');
            }
        })
    .catch (error => {
        //get contacts from localstorage
        let contacts = JSON.parse(localStorage.getItem("contacts"))
        if (!contacts) return
        const lastContactId = contacts[contacts.length - 1].id
        newContact.id = lastContactId + 1
        contacts.push(newContact)
        localStorage.setItem("contacts", JSON.stringify(contacts))
        location.reload()
    })
}

document.getElementById('searchContactBtn').onclick = () => {
    let name = document.getElementById('Name').value
    let phone = document.getElementById('Phone').value

    container.innerHTML = "";
    contactsDisplayed
        .filter(el => (name !== '' && el.Name.includes(name)) || (phone !== '' && el.Phone.includes(phone)))
        .forEach(element => container.appendChild(createContactView(element)))
}

async function fetchContacts() {
    const response = await fetch('http://localhost:5000/contacts')
    const json = await (response.json())
    return json
}

function createContactView(contact) {
    const contactView = document.createElement('tr')

    const contactNameCell = document.createElement('td')
    const contactNameLink = document.createElement('a')

    contactNameLink.href = `contactDetail.html?id=${contact.id}`
    contactNameLink.innerText = contact.Name

    const contactPhoneCell = document.createElement('td')
    contactPhoneCell.innerText = contact.Phone

    contactNameCell.appendChild(contactNameLink)
    contactView.appendChild(contactNameCell)
    contactView.appendChild(contactPhoneCell)

    return contactView
}