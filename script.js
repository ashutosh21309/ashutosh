var currentUser;

firebase.initializeApp({
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
});

var auth = firebase.auth();
var firestore = firebase.firestore();

auth.onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('blog-container').style.display = 'block';
        loadCategories();
        loadFollowers();
        loadCollaborativePosts();
    } else {
        currentUser = null;
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('blog-container').style.display = 'none';
    }
});

function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            console.log('Login successful');
            loadFollowers();
            loadCollaborativePosts();
        })
        .catch(function (error) {
            console.error('Login failed:', error.message);
            alert('Login failed. Please try again.');
        });
}

function logout() {
    auth.signOut()
        .then(function () {
            console.log('Logout successful');
        })
        .catch(function (error) {
            console.error('Logout failed:', error.message);
            alert('Logout failed. Please try again.');
        });
}

function toggleLogin() {
    var authContainer = document.getElementById('auth-container');
    authContainer.style.display = (authContainer.style.display === 'none') ? 'block' : 'none';
}

function addPost() {
    var postTitle = document.getElementById('post-title').value;
    var postCategory = document.getElementById('post-category').value;
    var postContent = document.getElementById('post-content').value;

    if (postTitle && postCategory && postContent) {
        firestore.collection('posts').add({
            title: postTitle,
            category: postCategory,
            content: postContent,
            author: currentUser.email,
            contributors: [currentUser.email], // Initial contributor is the author
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function (docRef) {
            console.log('Post added with ID: ', docRef.id);
            loadPosts();
        })
        .catch(function (error) {
            console.error('Error adding post: ', error);
            alert('Failed to add post. Please try again.');
        });
    } else {
        alert('Please fill in all fields for the post.');
    }
}

function startCollaborativeWriting() {
    var selectedPostId = document.getElementById('collaborative-post-list').value;

    if (selectedPostId) {
        // Redirect to a collaborative writing page or open a collaborative writing modal
        // with the specified post ID. You can implement real-time collaborative editing
        // using technologies like Firebase Realtime Database or Firestore.
        console.log('Started collaborative writing for post ID: ', selectedPostId);
    } else {
        alert('Please select a post to start collaborative writing.');
    }
}

function loadCollaborativePosts() {
    var collaborativePostList = document.getElementById('collaborative-post-list');

    firestore.collection('posts').where('contributors', 'array-contains', currentUser.email).get()
        .then(function (querySnapshot) {
            collaborativePostList.innerHTML = '';
            querySnapshot.forEach(function (doc) {
                var postId = doc.id;
                var postTitle = doc.data().title;
                var option = document.createElement('option');
                option.value = postId;
                option.textContent = postTitle;
                collaborativePostList.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error('Error loading collaborative posts: ', error);
            alert('Failed to load collaborative posts. Please try again.');
        });
}

// ... (Other functions such as loading and displaying notifications can be added)

// Call loadFollowers on initial page load
loadFollowers();
