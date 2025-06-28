import { CreateUserDto } from '@/model/models';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class SupabaseService {

    public async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw new Error(error.message);

        return {
            user: data.user,
            session: data.session
        }
    }

    public async createUser(user: CreateUserDto) {
        const response = await supabase.auth.signUp({
            email: user.email,
            password: user.password
        });

        await supabase.from('verbum_dei.user_profile').insert({
            name: user.name,
            user_id: response.data.user?.id
        });
    }
}