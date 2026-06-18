import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../i18n';

const CSS = `
.legal-page {
  max-width: 800px; margin: 0 auto; padding: 40px 28px;
  color: var(--white); font-family: 'Barlow', sans-serif;
  line-height: 1.8; min-height: 100vh; background: var(--bg);
}
.legal-back {
  background: transparent; border: none; color: var(--red);
  cursor: pointer; font-size: 14px; font-weight: 600;
  margin-bottom: 24px; padding: 0; display: flex; align-items: center; gap: 8px;
}
.legal-back:hover { opacity: 0.7; }
.legal-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
.legal-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px; font-weight: 900; color: var(--white); margin-bottom: 4px;
}
.legal-updated { font-size: 13px; color: var(--muted); }
.legal-lang { display: flex; gap: 4px; }
.legal-lang-btn {
  padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; border: 1px solid var(--border);
  background: transparent; color: var(--muted); font-family: 'Barlow', sans-serif;
}
.legal-lang-btn.active { background: var(--red); color: white; border-color: var(--red); }
.legal-section { margin-bottom: 28px; }
.legal-section h2 {
  font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 800;
  color: var(--white); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;
}
.legal-section p, .legal-section li { font-size: 14px; color: var(--muted); margin-bottom: 8px; }
.legal-section ul { padding-left: 20px; margin-bottom: 12px; }
.legal-section a { color: var(--red); text-decoration: none; }
.legal-section a:hover { text-decoration: underline; }
.legal-highlight {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 10px; padding: 16px; margin: 16px 0; font-size: 13px; color: var(--muted);
}
@media (max-width: 768px) { .legal-page { padding: 20px 16px; } .legal-title { font-size: 28px; } }
`;

const CONTENT = {
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: 18 de junio de 2026',
    sections: [
      { title: '1. Información General', content: [
        'PodioF1 ("nosotros", "la app") es una aplicación de predicciones deportivas de Fórmula 1 operada de forma independiente. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal.',
        'Al usar PodioF1, aceptás esta política de privacidad. Si no estás de acuerdo, por favor no uses la aplicación.'
      ]},
      { title: '2. Información que Recopilamos', content: [
        '<strong>Información que proporcionás directamente:</strong>',
        '<ul><li>Nombre y apellido</li><li>Dirección de correo electrónico</li><li>Fecha de nacimiento</li><li>País de residencia</li><li>Preferencias de F1 (escudería favorita, piloto favorito)</li><li>Respuestas a encuestas opcionales (vehículo, hábitos de visualización)</li></ul>',
        '<strong>Información recopilada automáticamente:</strong>',
        '<ul><li>Tipo de dispositivo y sistema operativo</li><li>Idioma del dispositivo</li><li>Datos de uso (predicciones, puntuaciones, badges)</li><li>Tokens de notificaciones push (si se habilitan)</li></ul>',
        '<div class="legal-highlight">⚠️ No recopilamos: información financiera, ubicación GPS precisa, contactos, fotos, ni accedemos a ningún dato sensible del dispositivo.</div>'
      ]},
      { title: '3. Cómo Usamos tu Información', content: [
        '<ul><li>Proporcionar y mejorar el servicio de predicciones</li><li>Gestionar tu cuenta y grupos</li><li>Calcular puntuaciones y rankings</li><li>Enviar notificaciones sobre carreras y resultados (si las habilitás)</li><li>Personalizar tu experiencia (colores de equipo, contenido relevante)</li><li>Generar estadísticas agregadas y anónimas sobre el uso de la app</li></ul>'
      ]},
      { title: '4. Compartir Información', content: [
        'Tu nombre y predicciones son visibles para otros miembros de tus grupos. Esta es la funcionalidad principal de la app.',
        '<strong>No vendemos ni compartimos tu información personal con terceros</strong> para fines publicitarios o de marketing.',
        'Podemos compartir información con:',
        '<ul><li><strong>Supabase:</strong> Proveedor de base de datos y autenticación</li><li><strong>Vercel:</strong> Proveedor de hosting</li><li><strong>Firebase Cloud Messaging:</strong> Envío de notificaciones push</li><li><strong>Vercel Analytics:</strong> Datos anónimos de uso</li></ul>'
      ]},
      { title: '5. Almacenamiento y Seguridad', content: [
        'Tu información se almacena en servidores seguros proporcionados por Supabase, con encriptación en tránsito (TLS) y en reposo. Las contraseñas se almacenan hasheadas y nunca en texto plano.',
        'Implementamos medidas de seguridad estándar de la industria, incluyendo autenticación basada en tokens (JWT), políticas de seguridad a nivel de fila (RLS) y acceso restringido a los datos.'
      ]},
      { title: '6. Tus Derechos', content: [
        '<ul><li><strong>Acceder</strong> a tus datos personales desde "Mi Perfil"</li><li><strong>Modificar</strong> tu información personal en cualquier momento</li><li><strong>Eliminar</strong> tu cuenta y todos los datos asociados</li><li><strong>Exportar</strong> tus datos en formato legible</li><li><strong>Desactivar</strong> las notificaciones push</li><li><strong>Revocar</strong> el consentimiento para encuestas opcionales</li></ul>',
        '<div class="legal-highlight">Para eliminar tu cuenta y todos los datos asociados, andá a Configuración → Eliminar mi cuenta, o enviá un email a <a href="mailto:privacy@podiof1.com">privacy@podiof1.com</a></div>'
      ]},
      { title: '7. Retención de Datos', content: [
        'Conservamos tu información mientras tu cuenta esté activa. Si eliminás tu cuenta, todos tus datos personales se eliminan permanentemente dentro de 30 días. Los datos estadísticos agregados y anónimos pueden conservarse indefinidamente.'
      ]},
      { title: '8. Menores de Edad', content: [
        'PodioF1 no está dirigido a menores de 13 años. No recopilamos intencionalmente información de niños menores de 13 años. Si descubrimos que un menor de 13 años nos ha proporcionado información personal, la eliminaremos de inmediato.'
      ]},
      { title: '9. Apuestas y Dinero', content: [
        '<div class="legal-highlight">⚠️ PodioF1 NO es una plataforma de apuestas. No gestiona, almacena ni transfiere dinero de ningún tipo. La función de "Pozo" es meramente informativa y la gestión de cualquier acuerdo económico entre participantes es responsabilidad exclusiva de los mismos.</div>'
      ]},
      { title: '10. Cookies y Almacenamiento Local', content: [
        'Usamos localStorage y sessionStorage del navegador para almacenar preferencias (tema, idioma) y tokens de autenticación. No usamos cookies de terceros para rastreo publicitario.'
      ]},
      { title: '11. Cambios en esta Política', content: [
        'Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos a través de la app o por email.'
      ]},
      { title: '12. Contacto', content: [
        'Email: <a href="mailto:privacy@podiof1.com">privacy@podiof1.com</a><br/>Web: <a href="https://podiof1.com">podiof1.com</a>'
      ]}
    ]
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 18, 2026',
    sections: [
      { title: '1. General Information', content: [
        'PodioF1 ("we", "the app") is an independently operated Formula 1 sports prediction application. This policy describes how we collect, use, store and protect your personal information.',
        'By using PodioF1, you accept this privacy policy. If you disagree, please do not use the application.'
      ]},
      { title: '2. Information We Collect', content: [
        '<strong>Information you provide directly:</strong>',
        '<ul><li>First and last name</li><li>Email address</li><li>Date of birth</li><li>Country of residence</li><li>F1 preferences (favorite team, favorite driver)</li><li>Responses to optional surveys (vehicle, viewing habits)</li></ul>',
        '<strong>Automatically collected information:</strong>',
        '<ul><li>Device type and operating system</li><li>Device language</li><li>Usage data (predictions, scores, badges)</li><li>Push notification tokens (if enabled)</li></ul>',
        '<div class="legal-highlight">⚠️ We do NOT collect: financial information, precise GPS location, contacts, photos, nor do we access any sensitive device data.</div>'
      ]},
      { title: '3. How We Use Your Information', content: [
        '<ul><li>Provide and improve the prediction service</li><li>Manage your account and groups</li><li>Calculate scores and rankings</li><li>Send notifications about races and results (if enabled)</li><li>Personalize your experience (team colors, relevant content)</li><li>Generate aggregate and anonymous usage statistics</li></ul>'
      ]},
      { title: '4. Sharing Information', content: [
        'Your name and predictions are visible to other members of your groups. This is the core functionality of the app.',
        '<strong>We do not sell or share your personal information with third parties</strong> for advertising or marketing purposes.',
        'We may share information with:',
        '<ul><li><strong>Supabase:</strong> Database and authentication provider</li><li><strong>Vercel:</strong> Hosting provider</li><li><strong>Firebase Cloud Messaging:</strong> Push notification delivery</li><li><strong>Vercel Analytics:</strong> Anonymous usage data</li></ul>'
      ]},
      { title: '5. Storage and Security', content: [
        'Your information is stored on secure servers provided by Supabase, with encryption in transit (TLS) and at rest. Passwords are stored hashed and never in plain text.',
        'We implement industry-standard security measures, including token-based authentication (JWT), row-level security policies (RLS) and restricted data access.'
      ]},
      { title: '6. Your Rights', content: [
        '<ul><li><strong>Access</strong> your personal data from "My Profile"</li><li><strong>Modify</strong> your personal information at any time</li><li><strong>Delete</strong> your account and all associated data</li><li><strong>Export</strong> your data in readable format</li><li><strong>Disable</strong> push notifications</li><li><strong>Revoke</strong> consent for optional surveys</li></ul>',
        '<div class="legal-highlight">To delete your account and all associated data, go to Settings → Delete my account, or send an email to <a href="mailto:privacy@podiof1.com">privacy@podiof1.com</a></div>'
      ]},
      { title: '7. Data Retention', content: [
        'We keep your information as long as your account is active. If you delete your account, all your personal data is permanently deleted within 30 days. Aggregate and anonymous statistical data may be retained indefinitely.'
      ]},
      { title: '8. Minors', content: [
        'PodioF1 is not intended for children under 13. We do not knowingly collect information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.'
      ]},
      { title: '9. Gambling and Money', content: [
        '<div class="legal-highlight">⚠️ PodioF1 is NOT a gambling platform. It does not manage, store or transfer money of any kind. The "Prize Pool" feature is purely informational and the management of any economic agreement between participants is their sole responsibility.</div>'
      ]},
      { title: '10. Cookies and Local Storage', content: [
        'We use browser localStorage and sessionStorage to store preferences (theme, language) and authentication tokens. We do not use third-party cookies for advertising tracking.'
      ]},
      { title: '11. Changes to This Policy', content: [
        'We may update this policy from time to time. We will notify you of significant changes through the app or by email.'
      ]},
      { title: '12. Contact', content: [
        'Email: <a href="mailto:privacy@podiof1.com">privacy@podiof1.com</a><br/>Web: <a href="https://podiof1.com">podiof1.com</a>'
      ]}
    ]
  },
  pt: {
    title: 'Política de Privacidade',
    updated: 'Última atualização: 18 de junho de 2026',
    sections: [
      { title: '1. Informações Gerais', content: [
        'PodioF1 ("nós", "o app") é um aplicativo independente de previsões esportivas de Fórmula 1. Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.',
        'Ao usar o PodioF1, você aceita esta política de privacidade. Se não concordar, por favor não use o aplicativo.'
      ]},
      { title: '2. Informações que Coletamos', content: [
        '<strong>Informações que você fornece diretamente:</strong>',
        '<ul><li>Nome e sobrenome</li><li>Endereço de e-mail</li><li>Data de nascimento</li><li>País de residência</li><li>Preferências de F1 (equipe favorita, piloto favorito)</li><li>Respostas a pesquisas opcionais (veículo, hábitos de visualização)</li></ul>',
        '<strong>Informações coletadas automaticamente:</strong>',
        '<ul><li>Tipo de dispositivo e sistema operacional</li><li>Idioma do dispositivo</li><li>Dados de uso (previsões, pontuações, badges)</li><li>Tokens de notificações push (se habilitados)</li></ul>',
        '<div class="legal-highlight">⚠️ NÃO coletamos: informações financeiras, localização GPS precisa, contatos, fotos, nem acessamos dados sensíveis do dispositivo.</div>'
      ]},
      { title: '3. Como Usamos Suas Informações', content: [
        '<ul><li>Fornecer e melhorar o serviço de previsões</li><li>Gerenciar sua conta e grupos</li><li>Calcular pontuações e rankings</li><li>Enviar notificações sobre corridas e resultados (se habilitadas)</li><li>Personalizar sua experiência (cores da equipe, conteúdo relevante)</li><li>Gerar estatísticas agregadas e anônimas sobre o uso do app</li></ul>'
      ]},
      { title: '4. Compartilhamento de Informações', content: [
        'Seu nome e previsões são visíveis para outros membros dos seus grupos. Esta é a funcionalidade principal do app.',
        '<strong>Não vendemos nem compartilhamos suas informações pessoais com terceiros</strong> para fins publicitários ou de marketing.',
        'Podemos compartilhar informações com:',
        '<ul><li><strong>Supabase:</strong> Provedor de banco de dados e autenticação</li><li><strong>Vercel:</strong> Provedor de hospedagem</li><li><strong>Firebase Cloud Messaging:</strong> Envio de notificações push</li><li><strong>Vercel Analytics:</strong> Dados anônimos de uso</li></ul>'
      ]},
      { title: '5. Armazenamento e Segurança', content: [
        'Suas informações são armazenadas em servidores seguros fornecidos pelo Supabase, com criptografia em trânsito (TLS) e em repouso. As senhas são armazenadas com hash e nunca em texto simples.',
        'Implementamos medidas de segurança padrão da indústria, incluindo autenticação baseada em tokens (JWT), políticas de segurança a nível de linha (RLS) e acesso restrito aos dados.'
      ]},
      { title: '6. Seus Direitos', content: [
        '<ul><li><strong>Acessar</strong> seus dados pessoais em "Meu Perfil"</li><li><strong>Modificar</strong> suas informações pessoais a qualquer momento</li><li><strong>Excluir</strong> sua conta e todos os dados associados</li><li><strong>Exportar</strong> seus dados em formato legível</li><li><strong>Desativar</strong> notificações push</li><li><strong>Revogar</strong> o consentimento para pesquisas opcionais</li></ul>',
        '<div class="legal-highlight">Para excluir sua conta e todos os dados associados, vá para Configurações → Excluir minha conta, ou envie um e-mail para <a href="mailto:privacy@podiof1.com">privacy@podiof1.com</a></div>'
      ]},
      { title: '7. Retenção de Dados', content: [
        'Mantemos suas informações enquanto sua conta estiver ativa. Se você excluir sua conta, todos os seus dados pessoais serão excluídos permanentemente dentro de 30 dias. Dados estatísticos agregados e anônimos podem ser mantidos indefinidamente.'
      ]},
      { title: '8. Menores de Idade', content: [
        'O PodioF1 não é destinado a menores de 13 anos. Não coletamos intencionalmente informações de crianças menores de 13 anos. Se descobrirmos que um menor de 13 anos nos forneceu informações pessoais, as excluiremos imediatamente.'
      ]},
      { title: '9. Apostas e Dinheiro', content: [
        '<div class="legal-highlight">⚠️ PodioF1 NÃO é uma plataforma de apostas. Não gerencia, armazena ou transfere dinheiro de nenhum tipo. O recurso "Bolão" é puramente informativo e a gestão de qualquer acordo econômico entre participantes é de responsabilidade exclusiva dos mesmos.</div>'
      ]},
      { title: '10. Cookies e Armazenamento Local', content: [
        'Usamos localStorage e sessionStorage do navegador para armazenar preferências (tema, idioma) e tokens de autenticação. Não usamos cookies de terceiros para rastreamento publicitário.'
      ]},
      { title: '11. Alterações nesta Política', content: [
        'Podemos atualizar esta política ocasionalmente. Notificaremos você sobre mudanças significativas através do app ou por e-mail.'
      ]},
      { title: '12. Contato', content: [
        'E-mail: <a href="mailto:privacy@podiof1.com">privacy@podiof1.com</a><br/>Web: <a href="https://podiof1.com">podiof1.com</a>'
      ]}
    ]
  }
};

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const { locale, setLocale } = useLanguageStore();
  const data = CONTENT[locale] || CONTENT.es;

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={theme} className="legal-page">
        <button className="legal-back" onClick={() => navigate(-1)}>← {locale === 'pt' ? 'Voltar' : locale === 'en' ? 'Back' : 'Volver'}</button>
        
        <div className="legal-header">
          <div>
            <h1 className="legal-title">{data.title}</h1>
            <div className="legal-updated">{data.updated}</div>
          </div>
          <div className="legal-lang">
            {['es', 'en', 'pt'].map(lang => (
              <button key={lang} className={`legal-lang-btn ${locale === lang ? 'active' : ''}`}
                onClick={() => setLocale(lang)}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {data.sections.map((section, i) => (
          <div key={i} className="legal-section">
            <h2>{section.title}</h2>
            {section.content.map((html, j) => (
              <div key={j} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}