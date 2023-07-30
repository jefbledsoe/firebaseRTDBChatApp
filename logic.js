(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyBvhrjmDVRsYwmimzRzfvyzd3Jp65IZR5c",
  authDomain: "courseproject-80c05.firebaseapp.com",
  databaseURL: "https://courseproject-80c05-default-rtdb.firebaseio.com",
  projectId: "courseproject-80c05",
  storageBucket: "courseproject-80c05.appspot.com",
  messagingSenderId: "958253825344",
  appId: "1:958253825344:web:0ceea5788ab012c212cea5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // handle on firebase db
  const db = firebase.database();

  // get elements
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const login = document.getElementById('login');
  const signup = document.getElementById('signup');
  const logout = document.getElementById('logout');
  const message = document.getElementById('message');
  const write = document.getElementById('write');
  const read = document.getElementById('read');
  const status = document.getElementById('status');
  const userNameDisplay = document.getElementById('name-display'); // element that can show the current user's email
  const chat = document.getElementById('chat-box');
  let currentUserEmail = ""; // variable to store the current user's email

  // write
  write.addEventListener('click', (e) => {
    const messages = db.ref('messages');
    
    const id = new Date().getTime();

    messages
      .child(id)
      .set({ 
        sender: currentUserEmail,
        message: message.value })
      .then(function () {
        console.log('Wrote to DB!');
      });
      message.value = '';
  });

  read.addEventListener('click', (e) => {
    handleRead();
  });

   firebase.database().ref('messages').on('value', (snapshot) => {
    handleRead();
  });

  function handleRead() {
    status.innerHTML = '';
    chat.innerHTML = '';
    const messages = db.ref('messages');

    messages.once('value').then(function (dataSnapshot) {
      var data = dataSnapshot.val();
      if (data) {
        var keys = Object.keys(data);

        keys.forEach(function (key) {
          console.log(data[key]);
          chat.innerHTML +=
            (data[key]['sender'] || '') +
            '   :   ' +
            data[key].message +
            '<br><br>';
        });
      }
    });
  }

  // update the current user's email
  function updateCurrentUser(userEmail) {
    userNameDisplay.innerHTML = userEmail;
    currentUserEmail = userEmail;

  }

  // login detection and update the current user's email
  login.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log('User Login Response: ', resp);
      logout.style.display = 'inline';
      login.style.display = 'none';
      signup.style.display = 'none';
      write.style.display = 'inline';
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // signup detection and update the current user's email
  signup.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log('User Signup + Login Response: ', resp);
      logout.style.display = 'inline';
      login.style.display = 'none';
      signup.style.display = 'none';
      write.style.display = 'inline';
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // logout detection and update the current user's email
  logout.addEventListener('click', (e) => {
    firebase
      .auth()
      .signOut()
      .then((resp) => {
        console.log('Logout Response: ', resp);
        logout.style.display = 'none';
        login.style.display = 'inline';
        signup.style.display = 'inline';
        write.style.display = 'none';
        updateCurrentUser('');
      })
      .catch((e) => console.warn(e.message));
  });
})();
