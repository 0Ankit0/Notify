# Notify

Notify is a robust notification service that allows you to send notifications to Firebase and OneSignal. This repository consists of two projects:

1. **Client Project**: Built with Next.js.
2. **Server Project**: Built with ASP.NET Core.

---

## Features
- **Notification Providers**: Supports Firebase and OneSignal for sending notifications.
- **JWT Authentication**: Ensures secure communication with the server.
- **Swagger Integration**: Provides API documentation for ease of use.
- **Custom Methods**: Includes reusable utility methods for various operations.
- **Extensible Design**: Easy to add more providers in the future.

---

## Project Structure

### Server Project

#### **Default Folders**
- **Controllers**: Contains API controllers to handle incoming requests.
- **Models**: Contains application data models.
- **Views**: Used for rendering views if applicable.

#### **Configuration Folder**
Contains configuration files such as:
- **JWT Configuration**
- **Swagger Configuration**

#### **Classes Folder**
Holds utility classes such as:
- **Custom Methods**
- **JWT Authentication Classes**

#### **Data Folder**
Contains models related to:
- DTOs (Data Transfer Objects)
- Entities

#### **Factory/NotificationFactory**
- Code for sending notifications.
- Supports sending notifications to Firebase or OneSignal.

#### **Filter Folder**
Contains the **Token Validation** logic used to validate API tokens while sending messages.

---

## API Usage

### Authentication
- Sending a message **does not require login**.
- However, you must include the `ApiToken` in the request header for authentication.

### Providers
To specify a provider, use the `ProviderEnum`:
```csharp
public enum ProviderEnum
{
    OneSignal,
    Firebase
}
```

### Message Model
This is the model used to structure the message:
```csharp
public class MessageModel
{
    public string? Receiver { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
}
```

### Endpoints

#### **Single Message**
To send a single message, make a POST request to:
```
api/Messages/
```
Request Body:
```json
{
    "Receiver": "receiver_id",
    "Title": "Notification Title",
    "Content": "Notification Content"
}
```

#### **Multiple Messages**
To send multiple messages, make a POST request to:
```
api/Messages/Multiple
```
Request Body:
```json
[
    {
        "Receiver": "receiver1_id",
        "Title": "Notification Title 1",
        "Content": "Notification Content 1"
    },
    {
        "Receiver": "receiver2_id",
        "Title": "Notification Title 2",
        "Content": "Notification Content 2"
    }
]
```

### Obtain ApiToken
- Run the project and generate the `ApiToken` from the application.

---

## Getting Started

### Prerequisites
- Node.js for the Next.js client.
- .NET SDK for the ASP.NET Core server.
- Firebase and/or OneSignal accounts for notification integration.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/0Ankit0/Notify.git
   ```
2. Navigate to the project directories and install dependencies:
   - **Client**: Navigate to the `client` folder and run `npm install`.
   - **Server**: Navigate to the `server` folder and restore NuGet packages.
3. Configure Firebase and OneSignal credentials in the server project.

### Running the Projects
- Start the server project using your preferred IDE or `dotnet run`.
- Start the client project using `npm run dev`.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contributions
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or bug reports.



