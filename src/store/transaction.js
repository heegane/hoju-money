import {defineStore} from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        users: {id:0, name:"", email:"", password:"", avatar:""},
        categorys: {id:0, type:0, typename:""},
        comes: {id:0, users_id:0, type:0, title:"", category_id:0, money:0, method:"", memo:"", date:""}
      }),

    actions: {
        async fetchData() {
            try {
              const [usersResponse, categorysResponse, comesResponse] = await Promise.all([
                axios.get(`http://localhost:3001/users`),
                axios.get(`http://localhost:3001/categorys`),
                axios.get(`http://localhost:3001/comes`),
              ]);
              this.users = usersResponse.data;
              this.categorys = categorysResponse.data;
              this.comes = comesResponse.data;
            } catch (error) {
              console.error('There was an error fetching the data!', error);
            }
        },

        // Create
        async createCome(come) {
            try {
                come.id = this.comes.length + 1;
                const response = await axios.post(`http://localhost:3001/comes`, come);
                this.comes.push(response.data);
            } catch (error) {
                console.error('There was an error creating the come!', error);
            }
        },

        // Read
        async getCome(id) {
            try {
                const response = await axios.get(`http://localhost:3001/comes/${id}`);
                return response.data;
            } catch (error) {
                console.error('There was an error fetching the come!', error);
            }
        },

        // Update
        async updateCome(come) {
            try {
                const response = await axios.put(`http://localhost:3001/comes/${come.id}`, come);
                const index = this.comes.findIndex(c => c.id === come.id);
                if (index !== -1) {
                    this.comes[index] = response.data;
                }
            } catch (error) {
                console.error('There was an error updating the come!', error);
            }
        },

        // Delete
        async deleteCome(id) {
            try {
                await axios.delete(`http://localhost:3001/comes/${id}`);
                this.comes = this.comes.filter(c => c.id !== id);
            } catch (error) {
                console.error('There was an error deleting the come!', error);
            }
        },
    },
});

export default useTransactionStore;