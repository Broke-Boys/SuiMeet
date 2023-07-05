module sui_meet::meet
{
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use std::string::{Self, String, utf8};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::linked_table::{Self, LinkedTable};
    use sui::tx_context::{Self, TxContext};
    use std::vector;
    use sui::display::{Self};
    use sui::package::{Self};
    use std::option::{Self, Option, none};
    use sui::vec_set::{Self, VecSet};

    // CONSTS

    const MAX_MESSAGE_LEN: u64 = 2000;
    const MAX_FILES_AMOUNT: u64 = 10;
    const MAX_COMMENTS_AMOUNT: u64 = 300;

    // ERRORS

    const E_ALREADY_FOLLOWED: u64 = 0;
    const E_NOT_FOLLOWED: u64 = 1;
    const E_WRONG_REGISTRY: u64 = 2;
    const E_SELF_SUBSCRIPTION: u64 = 3;

    const E_PROFILE_DOESNT_EXIST: u64 = 100;

    const E_ALREADY_LIKED: u64 = 200;
    const E_HASNT_BEEN_LIKED: u64 = 201;
    const E_SELF_DONATE: u64 = 202;
    const E_INVALID_TEXT_LENGTH: u64 = 203;
    const E_INVALID_AMOUNT_FILES: u64 = 204;
    const E_INVALID_AMOUNT_COMMENTS: u64 = 205;

    // Registry for Profiles to avoid multiple profiles
    // for one wallet
    struct Registry has key {
        id: UID,
        profiles: Table<address, address>,
        addresses: Table<address, address>
    }

    // Shared Object to keep track of user followers 
    struct FollowersRegistry has key {
        id: UID,
        followers: VecSet<address>,
        owner: address
    }

    // Some vector-backed collections where it possible will be replaced
    // with dynamic field-backed collections. In other cases data that they store
    // can be saved in some back-end systeml
    struct Profile has key, store {
        id: UID,
        name: String,
        image_url: String,
        description: Option<String>,
        total_donate: u64,
        likes: VecSet<address>,
        following: VecSet<address>,
        followers: address,
        posts: vector<address>,
        timestamp: u64,
        is_group: u8
    }

    // Owned by user "content" part of post
    struct Message has key, store {
        id: UID,
        timestamp: u64,
        author: address,
        text: String,
        files: String
    }

    // Owned by user
    struct Comment has key, store {
        id: UID,
        timestamp: u64,
        author: address,
        text: String,
        post_id: address
    }

    // Shared object consists of non-content info about post
    struct Post has key, store {
        id: UID,
        message: address,
        likes: VecSet<address>,
        comments: vector<address>,
        donated: u64,
        author: address
    }

    // EVENTS

    struct EventCreatePost has copy, drop {
        post_id: ID,
        author: address,
        timestamp: u64
    }

    struct EventMakeComment has copy, drop {
        comment_id: ID,
        author: address,
        timestamp: u64,
        post_id: address
    }

    struct EventCreateRegistry has copy, drop {
        registry_id: ID,
    }

    struct EventCreateFollowerRegistry has copy, drop {
        registry_id: ID,
        by: address
    }

    struct EventCreateProfile has copy, drop {
        profile_id: ID,
        creator: address, 
        name: string::String,
    }

    struct EventFollowed has copy, drop {
        follower_id: address,
        followed_on: address 
    }  

    struct EventDonate has copy, drop {
        sender: address,
        beneficiary: address,
        amount: u64,
        post_id: ID
    }


    // FUNCTIONS 

    // Profile functions
    public entry fun create_profile(
        registry: &mut Registry,
        name: vector<u8>,
        image_url: vector<u8>,
        clock: &Clock, 
        ctx: &mut TxContext
    ) {
        let profile_uid = object::new(ctx);
        let profile_addr = object::uid_to_address(&profile_uid);
        let sender_addr = tx_context::sender(ctx);

        let followers_uid = object::new(ctx);
        let followers_addr = object::uid_to_address(&followers_uid);

        let followers = FollowersRegistry {
            id: followers_uid,
            followers: vec_set::empty<address>(),
            owner: profile_addr
        };

        event::emit(EventCreateFollowerRegistry {
            registry_id: object::id(&followers),
            by: profile_addr
        });

        transfer::share_object(followers);

        let profile = Profile {
            id: profile_uid,
            name: utf8(name),
            description: none(),
            image_url: utf8(image_url),
            total_donate: 0,
            likes: vec_set::empty<address>(),
            following: vec_set::empty<address>(),
            followers: followers_addr,
            posts: vector::empty<address>(),
            timestamp: clock::timestamp_ms(clock),
            is_group: 0
        };

        table::add(&mut registry.profiles, sender_addr, profile_addr);
        table::add(&mut registry.addresses, profile_addr, sender_addr);

        event::emit(EventCreateProfile {
            profile_id: object::id(&profile),
            creator: sender_addr,
            name: profile.name,
        });

        transfer::public_transfer(profile, sender_addr);
    }

    public entry fun edit_profile(
        profile: &mut Profile,
        name: vector<u8>,
        image_url: vector<u8>,
        description: vector<u8>,
        is_group: u8,
        ctx: &mut TxContext
    ) {
        profile.name = utf8(name);
        profile.image_url = utf8(image_url);
        profile.is_group = is_group;
        option::swap_or_fill(&mut profile.description, utf8(description)); 
    }


    public entry fun follow_profile(
        profile: &mut Profile,
        followers_registry: &mut FollowersRegistry,
        followed_on: address,
        ctx: &mut TxContext
    ) {
        let profile_addr = object::id_to_address(&object::id(profile));
        assert!(!vec_set::contains(&profile.following, &followed_on), E_ALREADY_FOLLOWED);
        assert!(!vec_set::contains(&followers_registry.followers, &profile_addr), E_ALREADY_FOLLOWED);
        assert!(followers_registry.owner == followed_on, E_WRONG_REGISTRY);
        assert!(followers_registry.owner != profile_addr, E_SELF_SUBSCRIPTION);

        event::emit(EventFollowed {
            follower_id: profile_addr,
            followed_on: followed_on
        });

        vec_set::insert(&mut followers_registry.followers, profile_addr);
        vec_set::insert(&mut profile.following, followed_on);
    }

    public entry fun unfollow_profile(
        profile: &mut Profile,
        followers_registry: &mut FollowersRegistry,
        followed_on: address,
        ctx: &mut TxContext
    ) {
        let profile_addr = object::id_to_address(&object::id(profile));
        assert!(followers_registry.owner == followed_on, E_WRONG_REGISTRY);
        assert!(vec_set::contains(&profile.following, &followed_on), E_ALREADY_FOLLOWED);
        assert!(vec_set::contains(&followers_registry.followers, &profile_addr), E_ALREADY_FOLLOWED);

        vec_set::remove(&mut profile.following, &followed_on);
        vec_set::remove(&mut followers_registry.followers, &profile_addr);
    }

    // Post functions
    public entry fun create_post(
        profile: &mut Profile,
        text: vector<u8>,
        files: vector<u8>,
        clock: &Clock, 
        ctx: &mut TxContext
    )  {
        let text_len = vector::length(&text);
        let files_amount = vector::length(&text);
        assert!(text_len > 0 && text_len <= MAX_MESSAGE_LEN, E_INVALID_TEXT_LENGTH);
        assert!(files_amount > 0 && files_amount <= MAX_FILES_AMOUNT, E_INVALID_AMOUNT_FILES);

        let profile_addr = object::id_to_address(&object::id(profile));

        let timestamp = clock::timestamp_ms(clock);

        let post_uid = object::new(ctx);

        let message_uid = object::new(ctx);
        let message_addr = object::uid_to_address(&message_uid);

        let message = Message {
            id: message_uid,
            timestamp: timestamp,
            author: profile_addr,
            text: utf8(text),
            files: utf8(files)
        };

        let post = Post {
            id: post_uid,
            message: message_addr,
            likes: vec_set::empty<address>(),
            comments: vector::empty<address>(),
            donated: 0,
            author: profile_addr
        };

        event::emit(EventCreatePost {
            post_id: object::id(&post),
            author: profile_addr,
            timestamp: timestamp
        });

        transfer::share_object(post);

        vector::push_back(&mut profile.posts, message_addr);
        transfer::public_transfer(message, tx_context::sender(ctx));
    }

    public entry fun edit_post(
        message: &mut Message,
        text: vector<u8>,
        files: vector<u8>,
        ctx: &mut TxContext
    ) {
        message.text = utf8(text);
        message.files = utf8(files);
    }

    public entry fun like_post(
        post: &mut Post,
        profile: &mut Profile,
    ) {
        let profile_addr = object::id_to_address(&object::id(profile));
        let post_addr = object::id_to_address(&object::id(post));
        assert!(!vec_set::contains(&post.likes, &profile_addr), E_ALREADY_LIKED);
        assert!(!vec_set::contains(&profile.likes, &post_addr), E_ALREADY_LIKED);
        vec_set::insert(&mut post.likes, profile_addr);
        vec_set::insert(&mut profile.likes, post_addr);
    }

    public entry fun unlike_post(
        post: &mut Post,
        profile: &mut Profile,
    ) {
        let profile_addr = object::id_to_address(&object::id(profile));
        let post_addr = object::id_to_address(&object::id(post));
        assert!(vec_set::contains(&post.likes, &profile_addr), E_HASNT_BEEN_LIKED);
        assert!(vec_set::contains(&profile.likes, &post_addr), E_ALREADY_LIKED);
        vec_set::remove(&mut post.likes, &profile_addr);
        vec_set::remove(&mut profile.likes, &post_addr);
    }

    public entry fun make_comment(
        post: &mut Post,
        profile: &mut Profile,
        text: vector<u8>,
        clock: &Clock, 
        ctx: &mut TxContext
    ) {
        let text_len = vector::length(&text);
        assert!(text_len > 0 && text_len <= MAX_MESSAGE_LEN, E_INVALID_TEXT_LENGTH);
        assert!(vector::length(&post.comments) <= MAX_COMMENTS_AMOUNT, E_INVALID_AMOUNT_COMMENTS);

        let timestamp = clock::timestamp_ms(clock);
        let profile_addr = object::id_to_address(&object::id(profile));
        let post_addr = object::id_to_address(&object::id(post));

        let comment_id = object::new(ctx);

        let comment = Comment {
            id: comment_id,
            timestamp: timestamp,
            author: profile_addr,
            text: utf8(text),
            post_id: post_addr
        };

        let comment_addr = object::id_to_address(&object::id(&comment));
        vector::push_back(&mut post.comments, comment_addr);

        event::emit(EventMakeComment {
            comment_id: object::id(&comment),
            author: profile_addr,
            timestamp: timestamp,
            post_id: post_addr
        });

        transfer::public_transfer(comment, tx_context::sender(ctx));
    }

    public entry fun make_donate(
        post: &mut Post, registry: &Registry, payment: Coin<SUI>, ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);

        let sender = tx_context::sender(ctx);
        let sender_profile = *table::borrow(&registry.profiles, sender);
        let wallet_addr = *table::borrow(&registry.addresses, post.author);
        assert!(wallet_addr != sender, E_SELF_DONATE);
        post.donated = post.donated + amount;
        transfer::public_transfer(payment, wallet_addr);

         event::emit(EventDonate {
            post_id: object::id(post),
            sender: sender_profile,
            beneficiary: post.author,
            amount: amount
        });
    }

    // One-Time-Witness
    struct MEET has drop {}

    fun init(otw: MEET, ctx: &mut TxContext)
    {
        let publisher = package::claim(otw, ctx);

        let profile_display = display::new_with_fields<Profile>(
            &publisher,
            vector[
                utf8(b"name"),
                utf8(b"image_url"),
                utf8(b"description"),
                utf8(b"creator"),
                utf8(b"project_name"),
            ], vector[
                utf8(b"{name}"), // name
                utf8(b"{image_url}"), // image_url
                utf8(b"{description}"), // description
                utf8(b"Broke Boys Cartel"), // creator
                utf8(b"SuiMeet"), // project_name
            ], ctx
        );

        display::update_version(&mut profile_display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(profile_display, tx_context::sender(ctx));

        let registry_uid = object::new(ctx);
        let registry_id = object::uid_to_inner(&registry_uid);

        let registry = Registry {
            id: registry_uid,
            profiles: table::new(ctx),
            addresses: table::new(ctx)
        };
        transfer::share_object(registry);

        event::emit(EventCreateRegistry { registry_id });
    }

}
