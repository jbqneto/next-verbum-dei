'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cross, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
    open: boolean;
}

export default function AuthModal({ open }: AuthModalProps) {
    const { t } = useTranslation();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(formData.nickname, formData.email, formData.password);
            }

            if (!result.success) {
                setError(result.error || 'An error occurred');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(''); // Clear error when user starts typing
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ nickname: '', email: '', password: '' });
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Cross className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {isLogin ? t('welcomeBack') : t('joinCommunity')}
                    </DialogTitle>
                    <p className="text-muted-foreground">
                        {isLogin ? t('signInToContinue') : t('createAccountToStart')}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="nickname">{t('nickname')}</Label>
                            <Input
                                id="nickname"
                                type="text"
                                placeholder={t('enterNickname')}
                                value={formData.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                required={!isLogin}
                                className="sacred-shadow"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('enterEmail')}
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="sacred-shadow"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t('password')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('enterPassword')}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                                className="sacred-shadow pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full sacred-shadow"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isLogin ? t('signingIn') : t('creatingAccount')}
                            </>
                        ) : (
                            isLogin ? t('signIn') : t('createAccount')
                        )}
                    </Button>
                </form>

                <div className="text-center mt-6 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                    </p>
                    <Button
                        variant="link"
                        onClick={switchMode}
                        className="text-primary font-medium p-0 h-auto"
                        disabled={loading}
                    >
                        {isLogin ? t('createAccountLink') : t('signInLink')}
                    </Button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground">
                        {t('authDisclaimer')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
