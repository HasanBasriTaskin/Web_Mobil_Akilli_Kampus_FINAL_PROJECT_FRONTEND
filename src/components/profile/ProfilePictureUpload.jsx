'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { uploadProfilePicture } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Profile Picture Upload Component
 * Profil fotoğrafı yükleme ve önizleme
 */
export function ProfilePictureUpload({ currentPicture, onUploadSuccess }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const { user } = useAuthStore();

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Dosya tipi kontrolü
        if (!file.type.startsWith('image/')) {
            toast.error('Sadece resim dosyaları yüklenebilir');
            return;
        }

        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        // Önizleme oluştur
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Yükle
        setIsUploading(true);
        try {
            const response = await uploadProfilePicture(file);
            if (response.success) {
                toast.success('Profil fotoğrafı güncellendi');
                onUploadSuccess?.(response.data?.profilePictureUrl);
            }
        } catch (error) {
            toast.error('Fotoğraf yüklenemedi', {
                description: error.message || 'Lütfen tekrar deneyin.',
            });
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayImage = preview || currentPicture;

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative group">
                <div className="size-32 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt="Profil"
                            className="size-full object-cover"
                        />
                    ) : (
                        user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                    )}
                </div>

                {/* Upload overlay */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                    {isUploading ? (
                        <Loader2 className="size-8 animate-spin" />
                    ) : (
                        <Camera className="size-8" />
                    )}
                </button>

                {/* Clear preview button */}
                {preview && !isUploading && (
                    <button
                        onClick={clearPreview}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Upload button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Yükleniyor...
                    </>
                ) : (
                    <>
                        <Upload className="size-4" />
                        Fotoğraf Yükle
                    </>
                )}
            </Button>

            <p className="text-xs text-muted-foreground">
                Maksimum 5MB, JPG veya PNG
            </p>
        </div>
    );
}

export default ProfilePictureUpload;
