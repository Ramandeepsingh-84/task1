document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button');
    const postsContainer = document.getElementById('posts');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error');
    const postModal = document.getElementById('post-modal');
    const closeModalButton = document.querySelector('.close-button');
    const postDetailsContainer = document.getElementById('post-details');
    const commentsContainer = document.getElementById('comments');

    const apiUrl = 'https://jsonplaceholder.typicode.com';

    fetchButton.addEventListener('click', () => {
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        postsContainer.innerHTML = '';

        // Fetch posts and user data
        Promise.all([
            fetch(`${apiUrl}/posts`).then(response => {
                if (!response.ok) throw new Error('Failed to fetch posts');
                return response.json();
            }),
            fetch(`${apiUrl}/users`).then(response => {
                if (!response.ok) throw new Error('Failed to fetch users');
                return response.json();
            })
        ])
        .then(([posts, users]) => {
            loadingIndicator.style.display = 'none';

            const usersMap = users.reduce((map, user) => {
                map[user.id] = user;
                return map;
            }, {});

            posts.forEach(post => {
                const user = usersMap[post.userId];
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <div class="user-info">Posted by: ${user.name} (${user.email})</div>
                `;
                postElement.addEventListener('click', () => showPostDetails(post.id, post, user));
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error(error);
            loadingIndicator.style.display = 'none';
            errorMessage.style.display = 'block';
        });
    });

    // Display post details and comments
    function showPostDetails(postId, post, user) {
        fetch(`${apiUrl}/comments?postId=${postId}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch comments');
                return response.json();
            })
            .then(comments => {
                postDetailsContainer.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <div class="user-info">Posted by: ${user.name} (${user.email})</div>
                `;

                commentsContainer.innerHTML = '<h3>Comments:</h3>';
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.innerHTML = `
                        <p><strong>${comment.name}</strong> (${comment.email}):</p>
                        <p>${comment.body}</p>
                    `;
                    commentsContainer.appendChild(commentElement);
                });

                postModal.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
                alert('Failed to load comments');
            });
    }

    // Close the modal
    closeModalButton.addEventListener('click', () => {
        postModal.style.display = 'none';
    });

    window.addEventListener('click', event => {
        if (event.target === postModal) {
            postModal.style.display = 'none';
        }
    });
});
