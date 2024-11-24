// Sample JSON data
const bigCats = [
  {
    species: "Big Cat",
    name: "Caracal",
    size: "3 ft",
    location: "Africa",
    image:
      "https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg",
  },
  {
    species: "Big Cat",
    name: "Lion",
    size: "6 ft",
    location: "Africa",
    image:
      "https://i.natgeofe.com/n/5329307c-6c4a-40a8-a5ff-d38b8af2d929/caracal-thumbnail-nationalgeographic_2165629.jpg",
  },
];

const dogs = [
  {
    species: "Dog",
    name: "Beagle",
    size: "2 ft",
    location: "Europe",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM4Y145oMII5FYn9iomUJ4FB1incXpSCxCUQ&s",
  },
  {
    species: "Dog",
    name: "Husky",
    size: "4 ft",
    location: "Siberia",
    image:
      "https://cdn.shopify.com/s/files/1/0565/8021/0861/files/husky_banner.png?v=1705593234",
  },
];

const bigFish = [
  {
    species: "Big Fish",
    name: "Shark",
    size: "15 ft",
    location: "Ocean",
    image:
      "https://www.nhm.ac.uk/content/dam/nhmwww/discover/megalodon/megalodon_warpaint_shutterstock-full-width.jpg",
  },
  {
    species: "Big Fish",
    name: "Whale",
    size: "30 ft",
    location: "Ocean",
    image:
      "https://wwf.ca/wp-content/uploads/2024/07/Original_WW2153556-scaled.jpg",
  },
];

// Global variables
let editingIndex = null;
let activeDataSet = null;

// Render Tables
function renderTable(data, containerId, styles, sortableFields) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const table = document.createElement("table");

  // Table Header
  const header = table.createTHead();
  const headerRow = header.insertRow();
  Object.keys(data[0]).forEach((key) => {
    const cell = document.createElement("th");
    cell.textContent = key.toUpperCase();
    if (sortableFields.includes(key)) {
      cell.style.cursor = "pointer";
      cell.addEventListener("click", () =>
        sortTable(data, key, containerId, styles, sortableFields)
      );
    }
    headerRow.appendChild(cell);
  });
  headerRow.appendChild(document.createElement("th")).textContent = "Actions";

  // Table Body
  const body = table.createTBody();
  data.forEach((item, index) => {
    const row = body.insertRow();
    Object.keys(item).forEach((key) => {
      const cell = row.insertCell();
      if (key === "image") {
        const img = document.createElement("img");
        img.src = item[key];
        img.alt = item.name;
        img.style.height = "50px";
        cell.appendChild(img);
      } else {
        cell.textContent = item[key];
      }
    });

    // Actions
    const actionCell = row.insertCell();

    // Create Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      data.splice(index, 1);
      renderTable(data, containerId, styles, sortableFields);
    });

    // Create Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editingIndex = index; // Set the index of the row being edited
      const form = document.getElementById("popup-form");

      // Populate the form fields with the current row data
      form.elements["species"].value = item.species;
      form.elements["name"].value = item.name;
      form.elements["size"].value = item.size;
      form.elements["location"].value = item.location;

      // Update the image preview
      const preview = document.getElementById("image-preview");
      preview.innerHTML = ""; // Clear existing preview
      const img = document.createElement("img");
      img.src = item.image; // Use the image URL from the item
      img.style.height = "100px";
      img.alt = "Selected Image";
      preview.appendChild(img);

      // Show the popup for editing
      showPopup(activeDataSet);
    });

    // Create a container div for buttons
    const div = document.createElement("div");
    div.style.display = "flex"; // Arrange buttons horizontally
    div.style.gap = "5px"; // Add some space between buttons

    // Append buttons to the div
    div.appendChild(deleteBtn);
    div.appendChild(editButton);

    // Append the div to the action cell
    actionCell.appendChild(div);
  });

  container.appendChild(table);
}

// Show Popup
function showPopup(dataSet) {
  activeDataSet = dataSet;
  document.getElementById("popup-title").textContent = `Add/Edit ${dataSet}`;
  document.getElementById("popup").classList.remove("hidden");
}

function hidePopup() {
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("popup-form").reset();
  document.getElementById("image-preview").innerHTML = "";
}

// Submit Popup Form
function submitPopupForm() {
  const form = document.getElementById("popup-form");
  const formData = new FormData(form);

  const newRow = {
    species: formData.get("species"),
    name: formData.get("name"),
    size: formData.get("size"),
    location: formData.get("location"),
  };

  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];

  if (file) {
    newRow.image = URL.createObjectURL(file); // Temporarily use a local URL
  } else if (editingIndex !== null) {
    // Keep the existing image for edited rows if no new file is uploaded
    const dataSet = getDataSet(activeDataSet);
    newRow.image = dataSet[editingIndex].image;
  } else {
    newRow.image = "assets/default-animal.jpg"; // Default image for new rows
  }

  const dataSet = getDataSet(activeDataSet);

  // Validation
  if (
    editingIndex === null &&
    dataSet.some((item) => item.name === newRow.name)
  ) {
    alert("Duplicate name is not allowed.");
    return;
  }
  if (isNaN(parseFloat(newRow.size))) {
    alert("Size must be a valid number.");
    return;
  }

  if (editingIndex !== null) {
    // Edit existing row
    dataSet[editingIndex] = newRow;
    editingIndex = null; // Reset editing index
  } else {
    // Add new row
    dataSet.push(newRow);
  }

  renderTable(dataSet, `${activeDataSet}-table-container`, "bold", [
    "name",
    "size",
    "location",
  ]);
  hidePopup();
}

function getDataSet(dataSetName) {
  switch (dataSetName) {
    case "bigCats":
      return bigCats;
    case "dogs":
      return dogs;
    case "bigFish":
      return bigFish;
    default:
      return [];
  }
}

// Initialize Tables
document.addEventListener("DOMContentLoaded", () => {
  renderTable(bigCats, "bigCats-table-container", "bold", [
    "name",
    "size",
    "location",
  ]);
  renderTable(dogs, "dogs-table-container", "bold", [
    "name",
    "size",
    "location",
  ]);
  renderTable(bigFish, "bigFish-table-container", "bold", [
    "name",
    "size",
    "location",
  ]);
  editingIndex;
});

document.getElementById("image-input").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("image-preview");
  preview.innerHTML = ""; // Clear existing preview

  if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file); // Create a URL for the file
    img.style.height = "100px";
    img.alt = "Selected Image";
    preview.appendChild(img);
  } else {
    preview.innerHTML = "<label>No image selected. </label>";
  }
});
