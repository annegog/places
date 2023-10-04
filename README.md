# Web Application Technologies - TEDI

### Atalanti Papadaki - Anna Gogoula

---------------------------------------

   The project involves the development of a fully functional website for renting houses and rooms. The application allows users with different roles to search for and offer accommodations with ease and convenience. 
   Key features of the application include the ability to create user accounts, log in using email, and manage user profiles. 
   Renters can search for available accommodations based on their preferences and make reservations. They can also rate the accommodations they have used, access reviews and ratings from other users, aiding them in making accommodation choices.

   Users with the role of hosts can list their properties for rent, including providing detailed information such as the type of accommodation, location, available dates, pricing, and photos.

   Administrators have the ability to manage application users, verify accounts, and delete users when necessary.

   The project's goal is to create a flexible and enjoyable user experience while offering opportunities for renting and exploring houses.

- Architecture:
    The architecture of a web app is crucial for its effective development and operation. In the case of MERN (MongoDB, Express.js, React, Node.js), which we utilized, it represents a contemporary architecture widely used for web application development.
    * Code Structure and Organization
        -   client: This is where the React code resides, including components, routes, and styles.
        -   api: This folder contains the Node.js server code, including routes, controllers, and database-related files. Additionally, it includes a 'models' folder where MongoDB data models are stored. Another folder is for images, for rental and user profile photos.

   The MERN architecture allows for the development of a dynamic and efficient web app that leverages the advantages of JavaScript on both the client and server sides.
We used Express.js, as it helped us manage HTTP requests and create routes, allowing the creation of an API that connects the MongoDB database to the client side. Due to difficulties in implementing the SSL/TLS protocol, it is not included.

- Installation Instructions:
   Install yarn ('npm install --global yarn' if yarn is not already installed).
    *   Run 'yarn install'.
    *   To run the application (while in the 'airbnb' folder):
         -   Navigate to 'client' folder.
         -   Run 'yarn dev'.
         -   Navigate to 'api' folder.
         -   Run 'node index.js'.

The application runs on http://localhost:5173/, which is also displayed in the terminal when running 'yarn dev'.
      ➜ Local: http://localhost:5173/
      
(Note: The project has been run and tested only on Linux machines.)
