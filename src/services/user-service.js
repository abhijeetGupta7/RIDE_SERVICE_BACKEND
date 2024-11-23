const UserRepository = require("../repositories/user-repository");
const { createToken, verifyToken } = require("../utils/common/auth");

class UserService {
    #userRepository;
    constructor() {
        this.#userRepository=new UserRepository();
    }    
    
    async signIn(data) {
        try {
            const user=await this.#userRepository.getUserByEmail(data.email);
            if(!user) {
                throw new Error("User does not exist");
            }
            
            const isMatch=await user.comparePassword(data.password);
            if(!isMatch) {
                throw new Error("User and Password Does not Match");
            }
            
            const jwt=await createToken({userId:user._id, userEmail:user.email});
            console.log(jwt);
            return {userData: user, token:jwt};

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createUser(data) {
        try {
            const user=await this.#userRepository.create(data);
            
            const jwt=await createToken({userId:user._id, userEmail:user.email});
            return {userData: user, token:jwt};
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async authenticateUser(token) {
        try {
            const decodedToken=await verifyToken(token);
            
            const user=await this.#userRepository.get(decodedToken.userId);
            if(!user) {
                throw new Error("Given User does not exist");
            }
            return decodedToken;
        } catch (error) {
            throw error;
        }
    }

    async getUser(id) {
        try {
            const user=await this.#userRepository.get(id);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll() {
        try {
            const users=await this.#userRepository.getAll();
            return users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateUser(id,data) {
        try {
            const user=await this.#userRepository.update(id,data);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async deleteUser(id) {
        try {
            const user=await this.#userRepository.deleteById(id);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

module.exports=UserService;