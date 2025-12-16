'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Twitter, Linkedin, Github, CheckCircle2 } from 'lucide-react';

interface BlogAuthorCardProps {
  author: string;
  authorBio?: string;
  authorAvatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export default function BlogAuthorCard({ author, authorBio, authorAvatar, socialLinks }: BlogAuthorCardProps) {
  return (
    <div className="bg-purple-100 rounded-2xl p-6 sticky top-20">
      <h3 className="text-center text-lg font-bold text-gray-900 mb-4">Know your Author</h3>

      <div className="bg-[#1a1a2e] rounded-xl p-6 mb-4 text-center">
        {authorAvatar ? (
          <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-yellow-400">
            <Image
              src={authorAvatar}
              alt={author}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 mx-auto mb-4 flex items-center justify-center ring-4 ring-yellow-400/30">
            <span className="text-3xl font-bold text-gray-900">{author.charAt(0)}</span>
          </div>
        )}

        <div className="mb-2">
          <p className="text-white font-bold text-lg">{author}</p>
          <p className="text-gray-400 text-sm">@{author.toLowerCase().replace(/\s+/g, '')}</p>
        </div>

        {authorBio && (
          <p className="text-gray-300 text-sm mt-4 leading-relaxed px-2">{authorBio}</p>
        )}

        {socialLinks && (socialLinks.twitter || socialLinks.linkedin || socialLinks.github) && (
          <div className="flex justify-center gap-4 mt-5">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            )}
          </div>
        )}
      </div>

      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Book Consultation
      </Button>
    </div>
  );
}
