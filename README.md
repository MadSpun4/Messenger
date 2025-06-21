### Installation

1. **Clone the repository:**  
    ```bash  
    git clone https://github.com/MadSpun4/Messenger.git
    ```
   
2. **Navigate to the Frontend and install the required dependencies:**  
    ```bash
    cd Frontend
    npm install
    ```
   
3. **Navigate to the Backend and install the required dependencies:**  
    ```bash
    cd Backend
    mvn clean install
    ```
   
4. **Configure Environment Variables:**  
   Configure the Spring Boot application.properties for database and other configurations.

5. **Run the Application:**
    - Start the frontend:
      ```bash
      npm start
      ```
    - Start the backend:
      ```bash
      mvn spring-boot:run
      ```
