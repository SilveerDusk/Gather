import { ObjectId } from "mongoose";
import { IBasket } from "../../backend/models/basketSchema";
import { IItem } from "../../backend/models/itemSchema";
import { IUser } from "../../backend/models/userSchema";
import { IGroup } from "backend/models/groupSchema";

type updatedGroup = {
  groupName: string;
  description: string;
  privateGroup: string;
};

type updatedBasket = {
  basketName: string;
  description: string;
};

type updatedItem = {
  name: string;
  notes: string;
  toShare: string;
  isPrivate: string;
  price: string;
  quantity: string;
};

const token = localStorage.getItem("token");

export const addGroupToUser = async (user: IUser, groups: string[]) => {
  return fetch(`http://localhost:3001/users/${user._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ groups: groups }),
  });
};

export const editGroup = async (groupId: ObjectId, groupData: updatedGroup) => {
  return fetch(`http://localhost:3001/groups/${groupId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });
};

export const editBasket = async (
  basketId: string,
  basketData: updatedBasket,
) => {
  return fetch(`http://localhost:3001/baskets/${basketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(basketData),
  });
};

export const addItemToBasket = async (basketId: ObjectId, basketItems: ObjectId[]) => {
  return fetch(`http://localhost:3001/baskets/${basketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({items: basketItems}),
  });
};

export const editItem = async (itemId: string, itemData: updatedItem) => {
  return fetch(`http://localhost:3001/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });
};

export const moveItem = async (
  userBaskets: IBasket[],
  newBasket: IBasket,
  item: IItem,
) => {
  try {
    console.log(userBaskets);
    const itemBasket = userBaskets.find((b) => b._id === item.basket);
    console.log(itemBasket);
    const newBasketsItems = itemBasket?.items.filter((i) => i !== item._id);
    const removeItemFromBasket = await fetch(
      `http://localhost:3001/baskets/${item.basket}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newBasketsItems,
        }),
      },
    );
    if (removeItemFromBasket.ok) {
      console.log("Item removed from basket successfully");
    } else {
      console.error("Failed to remove item");
    }
    const updatedItem = await fetch(`http://localhost:3001/items/${item._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ basket: newBasket._id }),
    });
    if (updatedItem.ok) {
      console.log("Item added to basket successfully");
    } else {
      console.error("Failed to update item");
    }
    const updatedBasket = await fetch(
      `http://localhost:3001/baskets/${newBasket._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [...newBasket.items, item._id] }),
      },
    );
    if (updatedBasket.ok) {
      console.log("Item added to basket successfully");
    } else {
      console.error("Failed to update basket");
    }
  } catch (error) {
    console.error("Error moving item:", error);
  }
};

export const editUser = async (
  userId: string,
  userData: { firstName: string; lastName: string },
) => {
  return fetch(`http://localhost:3001/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const addBasketToGroup = async (
  group: IGroup,
  baskets: ObjectId[],
) => {
  return fetch(
    `http://localhost:3001/groups/${group._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ baskets: baskets }),
    }
  );
}

export const addUserToGroup = async (
  group: IGroup,
  users: ObjectId[],
) => {
  return fetch(
    `http://localhost:3001/groups/${group._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ members: users }),
    }
  );
}