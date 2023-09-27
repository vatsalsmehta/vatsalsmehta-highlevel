import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB();

const TABLE_NAME = "YourTableName";

async function lockItem(pk: string, sk: string): Promise<boolean> {
  const updateParams = {
    TableName: TABLE_NAME,
    Key: { "PK": { S: pk }, "SK": { S: sk } },
    UpdateExpression: "SET IsLocked = :lockValue",
    ConditionExpression: "attribute_not_exists(IsLocked)", // Lock only if not already locked
    ExpressionAttributeValues: { ":lockValue": { BOOL: true } },
  };

  try {
    await dynamoDB.updateItem(updateParams).promise();
    return true; // Lock acquired successfully
  } catch (error: any) {
    if (error.code === "ConditionalCheckFailedException") {
      return false; // Item is already locked
    }
    throw error; // Handle other errors
  }
}

async function unlockItem(pk: string, sk: string): Promise<void> {
  const updateParams = {
    TableName: TABLE_NAME,
    Key: { "PK": { S: pk }, "SK": { S: sk } },
    UpdateExpression: "REMOVE IsLocked", // Remove the lock flag
  };

  try {
    await dynamoDB.updateItem(updateParams).promise();
  } catch (error) {
    // Handle errors (e.g., item not found, DynamoDB issues)
    console.error("Error unlocking item:", error);
  }
}

// Usage example:
// const pkValue = "yourPKValue";
// const skValue = "yourSKValue";

// if (await lockItem(pkValue, skValue)) {
//   try {
//     // Execute operations on the locked item here
//   } finally {
//     await unlockItem(pkValue, skValue);
//   }
// } else {
//   console.log("Item is already locked, cannot process.");
// }
