import { supabase } from './supabaseClient';

export const authService = {
  async getCurrentUserWithRole() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, role')
        .eq('id', authUser.id)
        .single();

      let role = profile?.role;

      // If no role assigned yet, check if this is the first user
      if (!role) {
        const { count: profileCount } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' });

        role = profileCount === 1 ? 'admin' : 'observer';

        // Update the profile with the assigned role
        await supabase
          .from('profiles')
          .update({ role })
          .eq('id', authUser.id);
      }

      return {
        id: authUser.id,
        email: authUser.email,
        username: profile?.username || authUser.email.split('@')[0],
        role: role,
      };
    } catch (error) {
      console.error('Error getting user with role:', error);
      return null;
    }
  },

  async getAllUsers() {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, role, created_at')
        .order('created_at', { ascending: false });

      return profiles || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async updateUserRole(userId, newRole) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }
  },

  async createUserByAdmin(email, password, username, role = 'observer') {
    try {
      // Create auth user without email verification
      const { data: authData, error: signupError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (signupError) throw signupError;

      const userId = authData.user.id;

      // Create profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            username: username,
            role: role,
          },
        ]);

      if (profileError) throw profileError;

      return { success: true, userId };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  },

  async updateUser(userId, updates) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteUser(userId) {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  },
};