# vatsalsmehta-highlevel
This Contains the Solution for Fullstack Dev Hiring Challenge.

The Frontend Code is present in the folder frontend-v1.
The backend code is present in the folder serverside-v1.

A Small Introduction of the project before we deep dive into it.

### The backend has been designed and implemented keeping in mind the following Principles -
  1. Scalability - The System would be scalable only when its as efficient at a high request count as it was in low request count.
  2. Extendability - The System should be flexible enough to facilitate the add of new entitites and modules in the system without causing any major refractor.
  3. Modularity - Have divided the backend into separate, self-contained modules or components. This modular approach should make it easier to maintain and update specific parts of the system without affecting the entire codebase.

### The Frontend has been designed keeping the following things in mind - 
  1. Future Scope -  Although built for lower scale the choice of my frontend framework was Next.js keeping in mind the features we could extend to like Server Side Rendering, Hot Module Replacement (HMR), Static Site Generation (SSG), API Routes.
  2. Robustness - TypeScript's static typing helps catch errors at compile-time, leading to more robust code and reducing runtime errors.

### Database Design and Architecture -

The architecture choice I made over here is that of [Single Table Design Pattern](https://medium.com/telemetryhub-dev/dynamodb-single-table-design-d60be6aa2298).

Used Aws Dynamodb For this since Dynamodb and Mongodb (both NOSQL databases) have similar capabilities (both make use of internal indexing for efficient data retrieval and query performance, even for large and highly scalable databases as well as sharding for horizontal scaling). 

Here's an example on how it works -
1. General Example
<img width="912" alt="Screenshot 2023-09-21 at 10 03 46 PM" src="https://github.com/vatsalsmehta/vatsalsmehta-highlevel/assets/59135839/382c74f6-5da1-4616-bb40-ea9328551c30">

2. Our Scenario
<img width="845" alt="Screenshot 2023-09-21 at 8 24 38 PM" src="https://github.com/vatsalsmehta/vatsalsmehta-highlevel/assets/59135839/999319ff-a7f2-489d-a15f-7c61307af6dd">

### Primary Reason for choosing this NoSql architecture -
1. With increase in volume multi table Sql databases prove to be costly due to involvement of Complex Joins. The Read Cost Per Unit ( different cloud services may have different names for the same ) increases significantly as the table size grows. This is usually countered by creating clustered and non clustered indexes but that comes with a tradeoff of maintaining the db as Fragmentation grows.
2. At the same time the Read Cost Per Unit stays linear with your db size and doesn't grow exponentially with the size. Since it involves querying purely with the Primary Key and Secondary Key ( behind the scene is indexing which makes you prevent querying the whole db for your record). This pattern was implemented by me in a payment use-case in my career and has the least overhead I feel.

   <img width="736" alt="Screenshot 2023-09-21 at 11 28 17 PM" src="https://github.com/vatsalsmehta/vatsalsmehta-highlevel/assets/59135839/4b56289c-859b-478f-92ad-d9a1122e2b69">

Handling of Concurrent Requests:

Here's how DynamoDB handles concurrent requests:

Conditional Expressions: When you perform a write operation, you can specify a condition using a Conditional Expression. For example, you can specify that you want to update an item only if a certain attribute has a specific value.

Versioning and Timestamps: Some applications use version numbers or timestamps to track changes to items. You can include a condition that checks the version number or timestamp to ensure that you're updating the latest version of the item.

Transactions: DynamoDB supports transactions, which allow you to group multiple operations (read and write) together into a single, atomic unit. This ensures that all operations in the transaction succeed or fail together. Transactions can be helpful in managing concurrent updates. This also prevents dirty reads and are the most suitable for concurrent requests.
