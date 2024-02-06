import { Constant } from "@/constants/constant";
import { userProps } from "@/interface/data";

export interface handelSendRequestProps {
    id: Number,
    friendId: Number
    setSend: (value: React.SetStateAction<boolean>) => void
}

export const handelSendRequest = async ({ id, friendId, setSend }: handelSendRequestProps) => {
    try {
        const response = await fetch(`${Constant.API_URL}/friends/send-request/${friendId}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {

            setSend((pr) => !pr)

        } else {
            console.error('Failed to send friend request.');
        }
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
};