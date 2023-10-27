import { Filter, ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Collection, Location, Map, Pin, PinPoint, Post, User, WebSession } from "./app";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";

class Routes {
  /**
   * Find the current user associated with the session
   **/
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getById(user);
  }

  /**
   * Returns all users
   **/
  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  /**
   * Finds exactly one user with given username
   */
  @Router.get("/users/:username")
  async getUser(username: string) {
    return (await User.getUsers(username))[0];
  }

  /**
   * Creates a new user with given username
   */
  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  /**
   * Applies filter to update user currently logged in
   */
  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  /**
   * Logs in user with given username and password
   */
  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  /**
   * Logs out currently active user
   */
  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(query: Filter<PostDoc>) {
    return await Post.read(query);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string) {
    const user = WebSession.getUser(session);
    return await Post.create(user, content);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    // Make sure the user deleting is the author of the post
    const sessionUser = WebSession.getUser(session);
    const post = await Post.posts.readOne({ _id });

    if (post === null) {
      throw new Error("post not found");
    }

    const postUser = post.author;

    if (postUser !== sessionUser) {
      throw new PostAuthorNotMatchError(postUser, sessionUser);
    }

    return await Post.delete(_id);
  }

  /**
   * Creates new map
   */
  @Router.post("/map")
  async createMap(locations?: Array<ObjectId>, pins?: Array<ObjectId>, currLocation?: ObjectId) {
    return await Map.createMap(locations, pins, currLocation);
  }

  /**
   * Creates new map
   */
  @Router.get("/map/:mapid/pins")
  async getPins(mapid: ObjectId) {
    return await Map.getPins(mapid);
  }

  /**
   * Creates new map
   */
  @Router.get("/map/:mapid/pins/locations")
  async getPinLocations(mapid: ObjectId) {
    const pins = (await Map.getPins(mapid)).pins;
    const pinLocationIds: Array<ObjectId> = Array<ObjectId>();
    for (let i = 0; i < pins.length; ++i) {
      pinLocationIds.push((await Pin.getLocation(pins[i])).location);
    }
    const pinLocations: Array<[number, number]> = Array<[number, number]>();

    for (let i = 0; i < pinLocationIds.length; ++i) {
      const location = await Location.getCoordinates(pinLocationIds[i]);
      pinLocations.push([location.x, location.y]);
    }

    return pinLocations;
  }

  /**
   * Select or deselect coordinates on the map and create a new location there if
   * it does not already exist
   */
  @Router.patch("/map/:mapid/:x/:y")
  async selectLocation(session: WebSessionDoc, mapid: ObjectId, x: number, y: number) {
    const location = (await Location.createLocation(x, y)).location;
    return await Map.selectLocation(mapid, location._id);
  }

  /**
   * Create new pin at current location and add to map
   */
  @Router.patch("/map/:mapid/pin")
  async dropPin(session: WebSessionDoc, mapid: ObjectId) {
    const user = WebSession.getUser(session);
    const currLocation = (await Map.getCurrLocation(mapid)).currLocation;
    if (currLocation === undefined) {
      return { msg: "Cannot drop Pin at undefined location" };
    }
    const pin = (await Pin.dropPin(user, currLocation)).pin;
    return await Map.addPin(mapid, pin._id);
  }

  /**
   * Remove pin from map
   */
  @Router.delete("/map/:mapid/pins/:pinid")
  async removePin(session: WebSessionDoc, mapid: ObjectId, pinid: ObjectId) {
    const user = WebSession.getUser(session);
    await Pin.sanitizePin(pinid, user);
    return await Map.removePin(mapid, pinid);
  }

  /**
   * Find all pinpoints associated with a location
   */
  @Router.get("/pin/:pin/pinpoints")
  async getPinPoints(pin: ObjectId) {
    return await PinPoint.read({ pin });
  }

  /**
   * Read pinpoints for currentuser
   */
  @Router.get("/pinpoints/user")
  async getPinPointsByUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await PinPoint.read({ user });
  }

  /**
   * Creates a new PinPoint with given content and caption
   */
  @Router.post("/pinpoints/:pin/:caption")
  async createPinPoint(session: WebSessionDoc, pin: ObjectId, image: string, caption?: string) {
    console.log("pin", pin);
    console.log("image", image);
    console.log("caption", caption);
    const user = WebSession.getUser(session);
    return await PinPoint.makePost(pin, image, caption, user);
  }

  /**
   * Edits the caption of an existing pinpoint
   */
  @Router.patch("/pinpoints/edit/:pinpointid/:caption")
  async editCaption(session: WebSessionDoc, pinpointid: ObjectId, caption: string) {
    const user = WebSession.getUser(session);
    return await PinPoint.editCaption(pinpointid, caption, user);
  }

  /**
   * Delete a pinpoint
   */
  @Router.delete("/pinpoints/user/:_id")
  async deletePinPoint(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await PinPoint.deletePost(_id, user);
  }

  /**
   * Get all collections accessible by user
   */
  @Router.get("/collection")
  async getAllCollections(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Collection.read({ users: user });
  }

  /**
   * Search for a collection by name
   */
  @Router.get("/collection/:name")
  async getCollection(session: WebSessionDoc, name: string) {
    const user = WebSession.getUser(session);
    return await Collection.getCollectionByName(name, user);
  }

  /**
   * Create a new collection
   */
  @Router.post("/collection/new/:name")
  async createCollection(session: WebSessionDoc, name: string) {
    const user = WebSession.getUser(session);
    return await Collection.create(user, name);
  }

  /**
   * Adds a pin to a collection
   */
  @Router.patch("/collection/:name/pins/:pinid")
  async addPinToCollection(session: WebSessionDoc, name: string, pinid: ObjectId) {
    const user = WebSession.getUser(session);
    const collection = (await Collection.getCollectionByName(name, user)).collection;
    console.log(collection.users);
    await Pin.getPinById(pinid); // throw error if pin does not exist
    return await Collection.addPin(collection._id, user, pinid);
  }

  /**
   * Gives a new user access to a collection
   */
  @Router.patch("/collection/:name/users/:username")
  async giveAccessToCollection(session: WebSessionDoc, name: string, username: string) {
    const user = WebSession.getUser(session);
    const newUser = await User.getUserByUsername(username);

    const collection = (await Collection.getCollectionByName(name, user)).collection;
    return await Collection.addUser(collection._id, user, newUser._id);
  }
}

export default getExpressRouter(new Routes());
