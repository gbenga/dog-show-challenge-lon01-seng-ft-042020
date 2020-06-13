const dogsURL = 'http://localhost:3000/dogs'
const existingDogForm = document.querySelector('#dog-form');

document.addEventListener('DOMContentLoaded', () => {

    renderDogs();
    existingDogForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const form = e.target
        patch(form)
        // updates the frontend MANUALLY with fields from the form (need to refresh)
        .then(function () {
            // finds the row of the table to edit (this is why I gave every row a name of dogObject.id)
            const dogRowThatHasBeenEdited = document.getElementsByName(`${parseInt(form.id)}`);
            dogRowThatHasBeenEdited[0].childNodes[0].innerText = form.name.value
            dogRowThatHasBeenEdited[0].childNodes[1].innerText = form.breed.value
            dogRowThatHasBeenEdited[0].childNodes[2].innerText = form.sex.value
        })
    });
})
// send an updated dog to the db
function patch(form) {
    const editedDog = {
        name: form.name.value,
        breed: form.breed.value,
        sex: form.sex.value
    }
    
    const configObject = {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify(editedDog)
    };
    
    return fetch(`${dogsURL}/${form.id}`, configObject)
    .then(resp => resp.json())
    // to autorefresh
    .then(renderDogs())
    .catch(function(error) {
        console.log("Updating the dog in the database didn't work");
        console.error(error);
    })
}
// render every dog that has been fethed
function renderDogs() {
    fetchDogs()
    .then((dogs) => dogs.forEach(dog => {
        renderDog(dog);
    }));
}
// fetch all the dogs
function fetchDogs() {
    return fetch(dogsURL)
    .then(function (response) {
    return response.json();
    })
    .catch(function(error) {
        console.error("there was an error fetching the dogs");
        alert(error);
    });
}

function renderDog(dogObject) {
    const registeredDogTableBody = document.querySelector('#table-body');
    // Makes the row
    const dogRow = document.createElement("tr");
    dogRow.setAttribute("name",dogObject.id)
    // makes each cell & populates
    const dogNameCell = document.createElement("td");
    dogNameCell.innerText = dogObject.name;

    const dogBreedCell = document.createElement("td");
    dogBreedCell.innerText = dogObject.breed;

    const dogSexCell = document.createElement("td");
    dogSexCell.innerText = dogObject.sex;

    const editButton = document.createElement("button");
    editButton.innerText = "Edit"
    // event listener to populate the fields of the form 
    editButton.addEventListener("click", function(e) {
        e.preventDefault();
        const theDogThatBelongsToThisButton = e.target.parentNode
        // populates the form 
        existingDogForm.childNodes[1].value = theDogThatBelongsToThisButton.childNodes[0].innerText;
        existingDogForm.childNodes[3].value = theDogThatBelongsToThisButton.childNodes[1].innerText;
        existingDogForm.childNodes[5].value = theDogThatBelongsToThisButton.childNodes[2].innerText;
        existingDogForm.id = dogObject.id;
      });
    // append to the DOM
    dogRow.appendChild(dogNameCell);
    dogRow.appendChild(dogBreedCell);
    dogRow.appendChild(dogSexCell);
    dogRow.appendChild(editButton);

    registeredDogTableBody.appendChild(dogRow);
}