'use client'

import { MessageCircle, X } from 'lucide-react'
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/constants'
import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50"
        style={{
          backgroundColor: '#25D366',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
        )}
      </motion.button>

      {/* Chat Preview */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-40 w-80 md:w-96 glass-dark rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#25D366' }}>
                <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Chat with us on WhatsApp</h4>
                <p className="text-sm text-muted-foreground">Typically replies within minutes</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about memberships, trainers, or facilities? We're here to help!
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl font-medium text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Start Chat
              </motion.button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}