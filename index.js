const container = document.getElementById("container")
let contactsDisplayed = []

fetchContacts().then( contacts => {
    contacts.forEach( element => container.appendChild(createContactView(element)))
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

document.getElementById('addContactBtn').onclick = () => {
    const newContact = {
        'Name': document.getElementById('Name').value,
        'Phone': document.getElementById('Phone').value,
        'Description': document.getElementById('Description').value
    }

    if (!newContact.Name || !newContact.Phone || !newContact.Description) {
        alert('nu lasati niciun camp gol')
        return
    }

    const phoneNumberRegex = /^(?:(?:\+|00)40|0)(?:(?:2[1-4]|3[1-9]|4[0-9]|5[1-9]|6[1-8]|7[1-9]|8[1-9]|9[1-8])[0-9]{7})$/;

    console.log(newContact)
    if (!phoneNumberRegex.test(newContact.Phone)) {
        alert('numarul de telefon nu e corect')
        return
    }

    fetch('http://localhost:5000/addContact', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact)
    }).then( () => location.reload() )
    .catch( () => {
        //get contacts from localstorage
        let contacts = JSON.parse(localStorage.getItem("contacts"))
        if (!contacts) return
        const lastContactId = contacts[contacts.length-1].id
        newContact.id = lastContactId+1
        contacts.push(newContact)
        localStorage.setItem("contacts", JSON.stringify(contacts))
        location.reload()
    })
}

document.getElementById('searchContactBtn').onclick = () => {
    let name = document.getElementById('Name').value
    let phone = document.getElementById('Phone').value

    contactsDisplayed = contactsDisplayed.filter( el =>el.Name.includes(name) || el.Phone.includes(phone) )
    container.innerHTML = "";
    contactsDisplayed.forEach(element => container.appendChild(createContactView(element)))
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