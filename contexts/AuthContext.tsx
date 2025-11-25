import { supabase } from "@/utils/supabase";
import { createContext, useEffect, useState } from "react";

interface AuthContextProps {
    user: any;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (params: any) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                setUser(null);
            } else if (session?.user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setUser(profileData ?? null);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    setUser(profileData ?? null);
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error('Login error:', error.message);
                setIsLoading(false);
                return false;
            }

            if (data.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError.message);
                    setUser({
                        id: data.user.id,
                        email: data.user.email!,
                        name: data.user.user_metadata.name || data.user.email!.split('@')[0]
                    });
                } else {
                    setUser(profileData);
                }
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            return false;
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            });

            if (error) {
                console.error('Registration error:', error.message);
                throw new Error(error.message);
            }

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email,
                        name,
                        username: email.split('@')[0]
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError.message);
                    throw new Error(`Error creando perfil: ${profileError.message}`);
                }

                setUser({
                    id: data.user.id,
                    email: data.user.email!,
                    name
                });
                return true;
            }

            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    const updateUser = async (params: any) => {
        try {
            const allowedFields = ["name", "username", "bio", "phone", "gender", "avatar_url"];
            const updateFields: any = {};
            allowedFields.forEach(field => {
                if (params[field] !== undefined) {
                    updateFields[field] = params[field];
                }
            });

            const { data, error } = await supabase
                .from("profiles")
                .update(updateFields)
                .eq("id", user.id)
                .select()
                .single(); // 👈 siempre un solo objeto

            if (error) {
                console.error("Error actualizando perfil:", error.message);
                return false;
            }

            setUser(data); // 👈 ahora user es un objeto actualizado
            return true;
        } catch (err) {
            console.error("Error en updateUser:", err);
            return false;
        }
    }

    const logout = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setIsLoading(false);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
