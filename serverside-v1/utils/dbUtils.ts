import { tableName, docClient } from "../utils/awsConfigs";
import { BadRequestError } from "./error";

export const getItemFromDb = async (pkValue: string, skValue: string) => {

    // to get a single record we search by its PK and SK as it gives response in the shortest retrieval time
    const params = {
        TableName: tableName,
        Key: {
            "PK": pkValue,
            "SK": skValue
        }
    };

    const awsTransactionResponse = await docClient.get(params, function(err, data) {
        if (err) {
          console.log("[getItemFromDb]: Error", err);
        } else {
          console.log("[getItemFromDb]: Read successfull", data.Item);
        }
    }).promise()

    return awsTransactionResponse.Item
}

export const putItemToDb = async (tableName: string, data: any, logName: string) => {

  const transactionItem = {
    TableName: tableName,
    Item: data
  };

  try {

    await docClient.put(transactionItem).promise();
    console.log(`[${logName}]: Item Saved Successfully`);

  } catch (err) {

    console.log(`[${logName}]: Save Failed ${JSON.stringify(err, null, 2)}`);
    throw new BadRequestError(JSON.stringify(err));
    
  }
};
