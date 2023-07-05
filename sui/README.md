# SuiMeet

Current version of the contract is located on  
- network: **testnet**   
- address: `0x7fb0e470fc784fbaa6e806d0b4d9781ab0a5a19dc363c8ae484073e520852aba`

## Publish the package

In order to create your own version of the contract 
```
sui client publish --gas-budget 100000000 | grep packageId
```


## Basics

The package defines a few main _structs_:

- `Registry` object is unique and shared. It exists in order to aviod multiple profiles for one wallet.
  
  ```
  struct Registry has key {
      id: UID,
      profiles: Table<address, address>,
      addresses: Table<address, address>
  }
  ```
- `Profile` objects are owned and editable:
  ```
  struct Profile has key, store {
      id: UID,
      name: String,
      image_url: String,
      description: Option<String>,
      ...
  }
  ```
- `Post` objects are shared however they refer to owned object `Message`:
  ```
  struct Post has key, store {
    id: UID,
    message: address,
    likes: VecSet<address>,
    comments: vector<address>,
    donated: u64,
    author: address
  }

  struct Message has key, store {
      id: UID,
      timestamp: u64,
      author: address,
      text: String,
      files: String
  }
  ```
- `Comment` objects are also owned by users:
  ```
  struct Comment has key, store {
      id: UID,
      timestamp: u64,
      author: address,
      text: String,
      post_id: address
  }
  ```

Call `create_profile`, `create_post` and `make_comment` respectively to create new objects.

Call `edit_profile` and `edit_post` to modify a `Profile` (fields `name`/`image_url`/`description`) and `Post` (fields `text`/`files`).

## Other features

This contract also provides following features:
- `(un)follow_profile` methods for (un)follow to another profiles
- `(un)like_post` methods for making likes to posts
- `make_donate` tips on posts that sends directly to post owner

All functions emit their corresponding Events, which can be extracted from the blockchain using the `suix_queryEvents` function from the Sui SDK.
## Current limitations and future plans

Due to our current, fully on-chain architecture, we have encountered limitations when implementing structures capable of holding large numbers of items (such as likes, comments and etc). Currently, these exist as vector-backed collections, as this approach allows for the fastest extraction of information. However, we are aware that as our audience and number of posts increase, such structures may not meet our requirements. Therefore, one of our primary objectives for future updates is either to find a way to combine dynamic field-backed collections with Programmable Transaction blocks, or to implement some form of back-end system with an integrated database (and sacrifice full decentralization).
