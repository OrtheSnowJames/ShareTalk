// Check for authentication
const token = localStorage.getItem('groupToken');
if (!token) {
    window.location.href = '/';
} else {
    // Add token to future requests
    fetch('/api/group-data', {
        headers: {
            'Authorization': token
        }
    });
}

console.log('exgroup');

// delete loading text
document.getElementById('loadtext').remove();

/*
 example fetch request
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    console.log(data);
    // Do something with the data
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
*/

//fetch group data

function getCurrentGroupId() {
    // Extract group ID from URL path
    const pathParts = window.location.pathname.split('/');
    const groupIndex = pathParts.indexOf('groups') + 1;
    return pathParts[groupIndex] || '';
}

// Fetch group data example
async function fetchGroupData() {
    try {
        const groupId = getCurrentGroupId();
        
        // Get main group data
        const response = await fetch('/api/group-data', {
            headers: {
                'Authorization': token,
                'Group-ID': groupId
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const groupData = await response.json();

        // Get pictures directory listing
        const picturesRes = await fetch(`/grpsrc/${groupId}/pictures`, {
            headers: { 'Authorization': token }
        });
        const pictures = await picturesRes.json();

        // Get albums directory listing
        const albumsRes = await fetch(`/grpsrc/${groupId}/albums`, {
            headers: { 'Authorization': token }
        });
        const albums = await albumsRes.json();

        // Display group name
        document.getElementById('welcomeMessage').textContent += groupData.groupName;
        
        const main = document.querySelector('main');
        
        // Pictures section
        const picturesSection = document.createElement('section');
        picturesSection.innerHTML = `
            <h2>Pictures</h2>
            <div class="pictures-grid">
                ${pictures.map(pic => {
                    if (pic.endsWith('.jpg') || pic.endsWith('.png') || pic.endsWith('.jpeg')) {
                        return `<div class="picture-item">
                            <img src="/grpsrc/${groupId}/pictures/${pic}" alt="${pic}">
                        </div>`;
                    } else {
                        return `<div class="picture-folder" data-folder="${pic}">
                            <h3>${pic}</h3>
                            <button onclick="loadPictureDetails('${pic}')">View Details</button>
                        </div>`;
                    }
                }).join('')}
            </div>
        `;
        main.appendChild(picturesSection);

        // Albums section
        const albumsSection = document.createElement('section');
        albumsSection.innerHTML = `
            <h2>Albums</h2>
            <div class="albums-grid">
                ${albums.map(album => `
                    <div class="album-folder" data-album="${album}">
                        <h3>${album}</h3>
                        <button onclick="loadAlbumContents('${album}')">Open Album</button>
                    </div>
                `).join('')}
            </div>
        `;
        main.appendChild(albumsSection);

    } catch (error) {
        console.error('Error fetching group data:', error);
        document.getElementById('welcomeMessage').textContent += 'Error loading group';
    }
}

// Helper functions for loading details
async function loadPictureDetails(pictureName) {
    try {
        const groupId = getCurrentGroupId();
        const infoRes = await fetch(`/grpsrc/${groupId}/pictures/${pictureName}/info.json`, {
            headers: { 'Authorization': token }
        });
        const commentsRes = await fetch(`/grpsrc/${groupId}/pictures/${pictureName}/comments.json`, {
            headers: { 'Authorization': token }
        });
        
        const info = await infoRes.json();
        const comments = await commentsRes.json();
        
        // Display the details (implement as needed)
        console.log('Picture details:', { info, comments });
    } catch (error) {
        console.error('Error loading picture details:', error);
    }
}

async function loadAlbumContents(albumName) {
    try {
        const groupId = getCurrentGroupId();
        const albumContents = await fetch(`/grpsrc/${groupId}/albums/${albumName}`, {
            headers: { 'Authorization': token }
        }).then(res => res.json());
        
        // Display album contents (implement as needed)
        console.log('Album contents:', albumContents);
    } catch (error) {
        console.error('Error loading album:', error);
    }
}

// Call the function when page loads
fetchGroupData();

// make test to display files
let imagetestfield = document.createElement('input');
imagetestfield.type = 'text';
imagetestfield.id = 'imagetestfield';
imagetestfield.placeholder = 'Enter image name';
let previousimage;
imagetestfield.addEventListener('change', function() {
try {    let img = document.createElement('img');
    if (previousimage) {
        previousimage.remove();
    }
    previousimage = img;
    img.src = `/grpsrc/${getCurrentGroupId()}/pictures/${this.value}`;
    document.body.appendChild(img);} catch (error) {
        console.error(`Error loading image: ${error}`);
    }
});
document.body.appendChild(imagetestfield);
