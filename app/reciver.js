/**TODO:
 * Here have to be client-server file for network functionality
 *
 * Type of events:
 * Join user to room
 * Create Sticker (room_id)
 * Add message to sticker (room_id, sticker_id)
 * Server:
 *  -Save to redis
 *  -Resend information to all users in room
 * Client:
 *  -show message.
 *  -if sticker not opened, mark it as unread (red)
 *
 * As your wish:
 * Client:
 *   Show, that new user has been added to your room
 * */