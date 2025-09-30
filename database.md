# milijuli donation sewa Database Structure (NoSQL / Firestore)

This document outlines a recommended database structure for the milijuli donation sewa application, designed for a NoSQL database like Google Firestore.

## Root Collections

-   `/users/{userId}`
-   `/projects/{projectId}`
-   `/donations/{donationId}`
-   `/platformSettings/{settingId}`

---

## 1. `users` Collection

Stores public and private information for each user.

**Path:** `/users/{userId}`

**Document Data:**

```json
{
  "name": "string",
  "email": "string",
  "avatarUrl": "string (URL)",
  "bio": "string",
  "joinedAt": "timestamp",
  "isAdmin": "boolean",
  "canCreateCampaigns": "boolean",
  "socials": {
    "linkedin": "string (URL)",
    "twitter": "string (URL)",
    "instagram": "string (URL)"
  }
}
```

### Subcollections of `users`:

-   **`friends`**: Stores a list of friends for each user.
    -   Path: `/users/{userId}/friends/{friendUserId}`
    -   Document Data: `{ "friendSince": "timestamp" }`
-   **`paymentMethods`**: Stores tokens for saved payment methods (e.g., Stripe customer ID).
    -   Path: `/users/{userId}/paymentMethods/{paymentMethodId}`
    -   Document Data: `{ "type": "string (card/bank)", "last4": "string", "brand": "string" }`
-   **`notifications`**: User-specific notifications.
    -   Path: `/users/{userId}/notifications/{notificationId}`
    -   Document Data: `{ "title": "string", "description": "string", "href": "string", "read": "boolean", "createdAt": "timestamp" }`

---

## 2. `projects` Collection

Stores all fundraising projects, whether created by admins or users.

**Path:** `/projects/{projectId}`

**Document Data:**

```json
{
  "name": "string",
  "organization": "string",
  "ownerId": "string (references /users/{userId})",
  "description": "string",
  "longDescription": "string (Markdown)",
  "imageUrl": "string (URL)",
  "imageHint": "string",
  "targetAmount": "number",
  "raisedAmount": "number",
  "donorsCount": "number",
  "verified": "boolean",
  "createdAt": "timestamp"
}
```

### Subcollections of `projects`:

-   **`updates`**: Project progress updates.
    -   Path: `/projects/{projectId}/updates/{updateId}`
    -   Document Data: `{ "title": "string", "description": "string", "date": "timestamp", "imageUrl": "string (URL)", "imageHint": "string", "isTransfer": "boolean", ... }`
-   **`expenses`**: Records of project spending.
    -   Path: `/projects/{projectId}/expenses/{expenseId}`
     `Document Data: { "item": "string", "amount": "number", "date": "timestamp", "receiptUrl": "string (URL)" }`
-   **`discussion`**: Comments and discussions for the project.
    -   Path: `/projects/{projectId}/discussion/{commentId}`
    -   Document Data: `{ "authorId": "string (references /users/{userId})", "text": "string", "date": "timestamp", "replyTo": "string (author name)" }`
-   **`wishlist`**: Specific items the project needs.
    -   Path: `/projects/{projectId}/wishlist/{wishlistItemId}`
    -   Document Data: `{ "name": "string", "description": "string", "quantityNeeded": "number", "quantityDonated": "number", "costPerItem": "number", "imageUrl": "string (URL)", "allowInKind": "boolean" }`
-   **`gateways`**: Custom payment gateways for the project.
    -   Path: `/projects/{projectId}/gateways/{gatewayName}`
    -   Document Data: `{ "enabled": "boolean", "qrValue": "string", "generatedQr": "string (URL)" }`

---

## 3. `donations` Collection

A unified log for all donations, both monetary and in-kind, for platform-wide tracking and ledgers.

**Path:** `/donations/{donationId}`

**Document Data (Monetary):**

```json
{
  "type": "monetary",
  "donorId": "string (references /users/{userId})",
  "projectId": "string (references /projects/{projectId})",
  "amount": "number",
  "currency": "string (e.g., 'NPR')",
  "date": "timestamp",
  "paymentGateway": "string"
}
```

**Document Data (In-Kind):**

```json
{
  "type": "in-kind",
  "donorId": "string (references /users/{userId})",
  "projectId": "string (references /projects/{projectId})",
  "wishlistItemId": "string (references /projects/{projectId}/wishlist/{wishlistItemId})",
  "itemName": "string",
  "quantity": "number",
  "donationMethod": "string (drop-off/pickup)",
  "pickupAddress": "string (if applicable)",
  "status": "string (Pending/Completed/Cancelled)",
  "pledgedAt": "timestamp"
}
```

---

## 4. `platformSettings` Collection

A collection for storing singleton documents that manage global site content and settings. This is more organized than having many separate root collections.

**Path:** `/platformSettings/{settingId}`

**Example Documents:**

-   **`aboutPage`**:
    -   Path: `/platformSettings/aboutPage`
    -   Document Data: `{ "mission": "string", "tagline": "string", "values": [ { "title": "string", "description": "string" } ] }`
-   **`careers`**:
    -   Path: `/platformSettings/careers`
    -   Document Data: ` { "openings": [ { "id": "string", "title": "string", "type": "string", ... } ] }`
-   **`helpCenter`**:
    -   Path: `/platformSettings/helpCenter`
    -   Document Data: `{ "contactInfo": { "email": "string", "phone": "string", "address": "string" }, "faqs": [ { "id": "string", "question": "string", "answer": "string" } ] }`
-   **`operationalCosts`**:
    -   Path: `/platformSettings/operationalCosts`
    -   Document Data: `{ "salaries": [...], "equipment": [...], "miscExpenses": [...] }`
-   **`socialLinks`**:
    -   Path: `/platformSettings/socialLinks`
    -   Document Data: `{ "whatsapp": "string", "viber": "string", ... }`
-   **`globalConfig`**:
    -   Path: `/platformSettings/globalConfig`
    -   Document Data: `{ "appName": "string", "campaignCreationEnabled": "boolean", "userQrPaymentsEnabled": "boolean", "showOperationalCostsTotal": "boolean", "paymentGateways": [ { "name": "string", ... } ] }`

This structure provides a robust and scalable foundation for building out the backend of the milijuli donation sewa application.
