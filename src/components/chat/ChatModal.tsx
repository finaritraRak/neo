import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Maximize2, Minimize2, Download } from 'lucide-react'; // j'ai ajouté Download pour l'icône
import { askAI } from '../../services/openrouter';
import jsPDF from 'jspdf';

interface ChatModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const ChatModal = ({ open, setOpen }: ChatModalProps) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'system', content: 'Tu es un assistant utile pour les utilisateurs de la plateforme Neo.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [typingResponse, setTypingResponse] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');

  useEffect(() => {
    if (!typingResponse) return;

    let currentIndex = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        currentIndex++;
        if (currentIndex > typingResponse.length) {
          clearInterval(interval);
          setMessages((old) => [...old, { role: 'assistant', content: typingResponse }]);
          setTypingResponse('');
          setLoading(false);
          return prev;
        }
        return typingResponse.slice(0, currentIndex);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [typingResponse]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await askAI(newMessages);
      setTypingResponse(aiResponse);
    } catch {
      setTypingResponse("Une erreur est survenue.");
    }
  };

  // Fonction pour générer et télécharger un PDF avec le texte donné
  const downloadPdf = (text: string, filename = 'reponse-assistant.pdf') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pageWidth - 2 * margin;

    // Découpage en lignes adaptées à la largeur
    const splitText = doc.splitTextToSize(text, maxLineWidth);

    doc.text(splitText, margin, 20);
    doc.save(filename);
  };

  if (!open) return null;

  return (
    <>
      <div
        className={`
          fixed top-0 right-0 z-50 flex flex-col
          bg-white shadow-xl border-l
          transition-all duration-300 ease-in-out
          ${isFullscreen 
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'w-[380px] h-[90vh] rounded-l-2xl'
          }
        `}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#131635', color: 'white' }}
        >
          <h2 className="text-lg font-semibold">Assistant IA</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label={isFullscreen ? 'Restaurer taille' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm bg-gray-50">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-center gap-2`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 break-words
                  ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-white text-left shadow-sm'}
                `}
              >
                {msg.content}
              </div>
              {/* Bouton téléchargement PDF uniquement sur réponses assistant */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => downloadPdf(msg.content, `reponse-${idx + 1}.pdf`)}
                  title="Télécharger cette réponse en PDF"
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          ))}

          {typingResponse && (
            <div className="flex justify-start items-center gap-2">
              <div className="max-w-[75%] rounded-lg p-3 break-words bg-white text-left shadow-sm">
                {displayedText}
                <span className="blink-cursor">|</span>
              </div>
              {/* Pas de bouton PDF sur réponse en cours de typing */}
            </div>
          )}

          {loading && !typingResponse && (
            <div className="text-center text-gray-500 italic">L'assistant réfléchit...</div>
          )}
        </div>

        <div className="border-t px-4 py-3 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Pose ta question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>
        </div>

        <style>{`
          .blink-cursor {
            animation: blink 1s steps(2, start) infinite;
            font-weight: 700;
            color: #131635;
          }
          @keyframes blink {
            to {
              visibility: hidden;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ChatModal;
