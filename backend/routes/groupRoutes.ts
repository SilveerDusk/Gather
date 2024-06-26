import express from "express";
import { Request, Response } from "express";
import Group, { IGroup } from "../models/groupSchema.js";
import { authenticateUser } from "../auth.js";
import connectDB from "../connection.js";

const router = express.Router();

// Route to get all groups
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  try {
    const users = await Group.find({});
    if (users.length === 0) {
      res.status(404).send("No groups found"); // Return a 404 status code if no users are found
    } else {
      res.send(users); // Return the found users
    }
  } catch (error) {
    res.status(500).send("Internal Server Error"); // Handle any unexpected errors
  }
});

// Route to get a specific group by ID or name
router.get(
  "/:groupid",
  authenticateUser,
  async (req: Request, res: Response) => {
    // Ensure the database connection
    connectDB();

    try {
      // Use findById correctly with the id parameter from the request
      const groupById = await Group.findById(req.params.groupid);

      // Check if group is null or undefined
      if (!groupById) {
        return res.status(404).send("No group found"); // Use return to exit the function after sending the response
      }

      // Send the found user
      res.send(groupById);
      console.log("Sent Group:", groupById);
    } catch (error) {
      console.log("Now trying to find by GroupName");
      try {
        const groupsByName = await Group.find({
          groupName: req.params.groupid,
        });
        console.log(groupsByName);
        if (!groupsByName) {
          return res.status(404).send("No groups found"); // Use return to exit the function after sending the response
        }

        // Send the found user
        res.send(groupsByName);
        console.log("Sent Groups", groupsByName);
      } catch (error) {
        console.error("Error fetching group:", error); // Log the error for debugging
        res.status(500).send("Internal Server Error");
      }
    }
  },
);

// Route to create a new group
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  try {
    console.log("Creating a new group with data:", req.body);
    //Create new group to add
    const { groupName, privateGroup, description, members, baskets } = req.body;
    if (!groupName || privateGroup == null || !description) {
      console.error("Missing required fields", req.body);
      return res.status(400).send("Missing required fields");
    }

    const GroupToAdd = new Group({
      groupName,
      privateGroup,
      description,
      members,
      baskets,
    });

    const newGroup = await GroupToAdd.save();
    console.log("New group created:", newGroup);
    res.status(201).send(newGroup);
  } catch (error) {
    console.error("Error adding the group:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update a group by ID
router.patch("/:id", authenticateUser, async (req: Request, res: Response) => {
  // Get user ID from URL
  const { id } = req.params;
  const updatedData: Partial<IGroup> = req.body; //Not a full update only partial

  try {
    connectDB();

    const updatedGroup = await Group.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updatedGroup) {
      return res.status(404).send("Group not found");
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating group: ", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a group by ID
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  connectDB();
  const { id } = req.params;
  try {
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).send({ message: "group not found" });
    }

    res.status(200).send({ message: "group Deleted Successfully", group });
  } catch (error) {
    console.error("Error deleting the group:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export { router as groupEndpoints };
