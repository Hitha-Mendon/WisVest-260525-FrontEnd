import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../services/ai-chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput = '';
  loading = false;
  messages: { from: 'user' | 'bot', text: string }[] = [
    { from: 'bot', text: 'Hi! I am your AI assistant. Ask me anything.' }
  ];

  constructor(private aiChat: AiChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ from: 'user', text: this.userInput });
    this.loading = true;
    this.aiChat.getResponse(this.userInput).subscribe(res => {
      this.messages.push({ from: 'bot', text: res });
      this.loading = false;
    }, () => {
      this.messages.push({ from: 'bot', text: 'Sorry, there was an error.' });
      this.loading = false;
    });
    this.userInput = '';
  }
}