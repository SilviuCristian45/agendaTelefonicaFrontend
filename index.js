const container = document.getElementById("container")

fetchContacts().then( (contacts) => 
    contacts.forEach(element => {
        container.appendChild(createContactView(element))  
    })
)

async function fetchContacts() {
    const response = await fetch('http://localhost:5000/contacts')
    const json = await (response.json())
    console.log(json)
    return json
}

function createContactView(contact) {
    const contactView = document.createElement('tr')
    
    const contactNameCell = document.createElement('td')
    contactNameCell.innerText = contact.Name
    

    contactView.appendChild(contactNameCell)
    return contactView
}