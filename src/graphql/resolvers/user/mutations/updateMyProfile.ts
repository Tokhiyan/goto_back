import User from "src/db/entities/User";
import { privateResolver } from "../../middlewares/privateResolver";
import { filterToNotNullObject } from "../../../../utils/filterNulls";
import { UpdateMyProfileArgs, UpdateMyProfileResponse } from "../types";

export const updateMyProfile = privateResolver<UpdateMyProfileResponse>(async (
    _root: undefined,
    { input }: UpdateMyProfileArgs,
    { user }
): Promise<UpdateMyProfileResponse> => {
    const { password } = input;
    const partialEntity = filterToNotNullObject<UpdateMyProfileArgs["input"]>(input);

    try {
        if (password) {
            user.password = password;
            await user.save();
        }

        await User.update({ "id": user.id }, { ...partialEntity });

        return {
            "success": true,
            "error": null,
        };
    } catch (error) {
        return {
            "success": false,
            "error": error.message,
        };
    }
});
