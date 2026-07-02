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
  cursor: pointer; font-size: var(--fs-body); font-weight: 600;
  margin-bottom: 24px; padding: 0; display: flex; align-items: center; gap: 8px;
}
.legal-back:hover { opacity: 0.7; }
.legal-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
.legal-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--fs-display); font-weight: 900; color: var(--white); margin-bottom: 4px;
}
.legal-updated { font-size: var(--fs-small); color: var(--muted); }
.legal-lang { display: flex; gap: 4px; }
.legal-lang-btn {
  padding: 4px 10px; border-radius: 6px; font-size: var(--fs-small); font-weight: 700;
  cursor: pointer; transition: all 0.2s; border: 1px solid var(--border);
  background: transparent; color: var(--muted); font-family: 'Barlow', sans-serif;
}
.legal-lang-btn.active { background: var(--red); color: white; border-color: var(--red); }
.legal-section { margin-bottom: 28px; }
.legal-section h2 {
  font-family: 'Barlow Condensed', sans-serif; font-size: var(--fs-section-title); font-weight: 800;
  color: var(--white); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;
}
.legal-section p, .legal-section li { font-size: var(--fs-body); color: var(--muted); margin-bottom: 8px; }
.legal-section ul { padding-left: 20px; margin-bottom: 12px; }
.legal-section a { color: var(--red); text-decoration: none; }
.legal-section a:hover { text-decoration: underline; }
.legal-highlight {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 10px; padding: 16px; margin: 16px 0; font-size: var(--fs-small); color: var(--muted);
}
@media (max-width: 768px) { .legal-page { padding: 20px 16px; } }
`;

const CONTENT = {
  es: {
    title: 'Términos y Condiciones de Uso',
    updated: 'Última actualización: 18 de junio de 2026',
    sections: [
      { title: '1. Aceptación de los Términos', content: [
        'Al crear una cuenta y usar Podio, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo, no uses la aplicación.'
      ]},
      { title: '2. Descripción del Servicio', content: [
        'Podio es una plataforma de entretenimiento que permite a los usuarios crear predicciones sobre resultados de carreras de automovilismo y competir con amigos en grupos privados.',
        '<ul><li>Creación y gestión de grupos de predicciones</li><li>Sistema de puntuación y rankings</li><li>Estadísticas y análisis de predicciones</li><li>Sistema de badges y logros</li><li>Información de pozo (meramente informativa)</li></ul>'
      ]},
      { title: '3. Cuenta de Usuario', content: [
        '<ul><li>Debés tener al menos 13 años para crear una cuenta</li><li>La información que proporciones debe ser veraz y actual</li><li>Sos responsable de mantener la seguridad de tu cuenta</li><li>No podés compartir tu cuenta con otras personas</li><li>Nos reservamos el derecho de suspender cuentas que violen estos términos</li></ul>'
      ]},
      { title: '4. Uso Aceptable', content: [
        'Al usar Podio, aceptás no:',
        '<ul><li>Usar la app para actividades ilegales o fraudulentas</li><li>Crear múltiples cuentas para manipular rankings</li><li>Acosar, intimidar o discriminar a otros usuarios</li><li>Intentar acceder a cuentas o datos de otros usuarios</li><li>Usar bots, scripts o herramientas automatizadas</li><li>Interferir con el funcionamiento de la plataforma</li><li>Usar la app para apuestas reales o intercambio de dinero</li></ul>'
      ]},
      { title: '5. No es Plataforma de Apuestas', content: [
        '<div class="legal-highlight">⚠️ <strong>IMPORTANTE:</strong> Podio es exclusivamente un juego de entretenimiento. NO es una plataforma de apuestas y NO facilita, gestiona, almacena ni transfiere dinero de ningún tipo.<br/><br/>La función "Pozo del Grupo" es meramente informativa. Podio no tiene responsabilidad alguna sobre acuerdos económicos entre usuarios.<br/><br/>El uso de la app para apuestas reales queda bajo la exclusiva responsabilidad de los usuarios y está sujeto a las leyes aplicables en su jurisdicción.</div>'
      ]},
      { title: '6. Propiedad Intelectual', content: [
        'Podio, su diseño, código y contenido son propiedad de Podio. Los nombres, logos y marcas de equipos, competiciones y pilotos son propiedad de sus respectivos titulares y se usan con fines informativos.',
        'Los datos de resultados de carreras se obtienen de fuentes públicas y son de dominio público.'
      ]},
      { title: '7. Contenido del Usuario', content: [
        'Las predicciones y datos que envíes son tu contenido. Al usar la app, otorgás a Podio una licencia no exclusiva para mostrar tus predicciones a otros miembros de tus grupos y para generar estadísticas agregadas.'
      ]},
      { title: '8. Suscripciones Premium (Futuro)', content: [
        '<ul><li>Los precios se informarán claramente antes de la compra</li><li>Las suscripciones se pueden cancelar en cualquier momento</li><li>Los reembolsos se manejarán según las políticas de la tienda de apps correspondiente</li><li>Las funcionalidades básicas del juego siempre serán gratuitas</li></ul>'
      ]},
      { title: '9. Disponibilidad del Servicio', content: [
        'Nos esforzamos por mantener la app disponible, pero no garantizamos un servicio ininterrumpido. Nos reservamos el derecho de modificar o discontinuar el servicio con previo aviso razonable.'
      ]},
      { title: '10. Limitación de Responsabilidad', content: [
        'Podio se proporciona "tal cual" sin garantías. No somos responsables de:',
        '<ul><li>Pérdidas derivadas del uso de la app</li><li>Inexactitud en los resultados de carreras</li><li>Acuerdos económicos entre usuarios</li><li>Daños derivados de interrupciones del servicio</li><li>Acciones de otros usuarios dentro de la plataforma</li></ul>'
      ]},
      { title: '11. Eliminación de Cuenta', content: [
        'Podés eliminar tu cuenta en cualquier momento desde Configuración → Eliminar mi cuenta.',
        '<ul><li>Todos tus datos personales serán eliminados permanentemente</li><li>Tus predicciones serán anonimizadas</li><li>Serás removido de todos tus grupos</li><li>Esta acción es irreversible</li></ul>',
        'También podés solicitar la eliminación por email a <a href="mailto:privacy@podio.lat">privacy@podio.lat</a>'
      ]},
      { title: '12. Ley Aplicable', content: [
        'Estos términos se rigen por las leyes de la República del Paraguay. Cualquier disputa será resuelta en los tribunales competentes de Asunción, Paraguay.'
      ]},
      { title: '13. Contacto', content: [
        'Email: <a href="mailto:legal@podio.lat">legal@podio.lat</a><br/>Web: <a href="https://podio.lat">podio.lat</a>'
      ]}
    ]
  },
  en: {
    title: 'Terms and Conditions of Use',
    updated: 'Last updated: June 18, 2026',
    sections: [
      { title: '1. Acceptance of Terms', content: [
        'By creating an account and using Podio, you accept these terms and conditions in their entirety. If you disagree, do not use the application.'
      ]},
      { title: '2. Service Description', content: [
        'Podio is an entertainment platform that allows users to create predictions about motorsport race results and compete with friends in private groups.',
        '<ul><li>Creation and management of prediction groups</li><li>Scoring system and rankings</li><li>Statistics and prediction analysis</li><li>Badges and achievements system</li><li>Prize pool information (purely informational)</li></ul>'
      ]},
      { title: '3. User Account', content: [
        '<ul><li>You must be at least 13 years old to create an account</li><li>Information you provide must be truthful and current</li><li>You are responsible for maintaining your account security</li><li>You may not share your account with others</li><li>We reserve the right to suspend accounts that violate these terms</li></ul>'
      ]},
      { title: '4. Acceptable Use', content: [
        'By using Podio, you agree not to:',
        '<ul><li>Use the app for illegal or fraudulent activities</li><li>Create multiple accounts to manipulate rankings</li><li>Harass, intimidate or discriminate against other users</li><li>Attempt to access other users\' accounts or data</li><li>Use bots, scripts or automated tools</li><li>Interfere with the platform\'s operation</li><li>Use the app for real gambling or money exchange</li></ul>'
      ]},
      { title: '5. Not a Gambling Platform', content: [
        '<div class="legal-highlight">⚠️ <strong>IMPORTANT:</strong> Podio is exclusively an entertainment game. It is NOT a gambling platform and does NOT facilitate, manage, store or transfer money of any kind.<br/><br/>The "Group Prize Pool" feature is purely informational. Podio bears no responsibility for economic agreements between users.<br/><br/>Use of the app for real gambling is the sole responsibility of users and is subject to applicable laws in their jurisdiction.</div>'
      ]},
      { title: '6. Intellectual Property', content: [
        'Podio, its design, code and content are property of Podio. Names, logos and trademarks of teams, competitions and drivers are property of their respective owners and are used for informational purposes.',
        'Race result data is obtained from public sources and is in the public domain.'
      ]},
      { title: '7. User Content', content: [
        'Predictions and data you submit are your content. By using the app, you grant Podio a non-exclusive license to display your predictions to other group members and to generate aggregate statistics.'
      ]},
      { title: '8. Premium Subscriptions (Future)', content: [
        '<ul><li>Prices will be clearly communicated before purchase</li><li>Subscriptions can be cancelled at any time</li><li>Refunds will be handled according to the respective app store policies</li><li>Basic game features will always be free</li></ul>'
      ]},
      { title: '9. Service Availability', content: [
        'We strive to keep the app available, but we do not guarantee uninterrupted service. We reserve the right to modify or discontinue the service with reasonable prior notice.'
      ]},
      { title: '10. Limitation of Liability', content: [
        'Podio is provided "as is" without warranties. We are not responsible for:',
        '<ul><li>Losses arising from use of the app</li><li>Inaccuracy in race results</li><li>Economic agreements between users</li><li>Damages from service interruptions</li><li>Actions of other users within the platform</li></ul>'
      ]},
      { title: '11. Account Deletion', content: [
        'You can delete your account at any time from Settings → Delete my account.',
        '<ul><li>All your personal data will be permanently deleted</li><li>Your predictions will be anonymized</li><li>You will be removed from all your groups</li><li>This action is irreversible</li></ul>',
        'You can also request deletion by email at <a href="mailto:privacy@podio.lat">privacy@podio.lat</a>'
      ]},
      { title: '12. Applicable Law', content: [
        'These terms are governed by the laws of the Republic of Paraguay. Any dispute will be resolved in the competent courts of Asunción, Paraguay.'
      ]},
      { title: '13. Contact', content: [
        'Email: <a href="mailto:legal@podio.lat">legal@podio.lat</a><br/>Web: <a href="https://podio.lat">podio.lat</a>'
      ]}
    ]
  },
  pt: {
    title: 'Termos e Condições de Uso',
    updated: 'Última atualização: 18 de junho de 2026',
    sections: [
      { title: '1. Aceitação dos Termos', content: [
        'Ao criar uma conta e usar o Podio, você aceita estes termos e condições em sua totalidade. Se não concordar, não use o aplicativo.'
      ]},
      { title: '2. Descrição do Serviço', content: [
        'Podio é uma plataforma de entretenimento que permite aos usuários criar previsões sobre resultados de corridas de automobilismo e competir com amigos em grupos privados.',
        '<ul><li>Criação e gestão de grupos de previsões</li><li>Sistema de pontuação e rankings</li><li>Estatísticas e análise de previsões</li><li>Sistema de badges e conquistas</li><li>Informação de bolão (meramente informativa)</li></ul>'
      ]},
      { title: '3. Conta de Usuário', content: [
        '<ul><li>Você deve ter pelo menos 13 anos para criar uma conta</li><li>As informações fornecidas devem ser verdadeiras e atuais</li><li>Você é responsável por manter a segurança da sua conta</li><li>Não pode compartilhar sua conta com outras pessoas</li><li>Reservamo-nos o direito de suspender contas que violem estes termos</li></ul>'
      ]},
      { title: '4. Uso Aceitável', content: [
        'Ao usar o Podio, você concorda em não:',
        '<ul><li>Usar o app para atividades ilegais ou fraudulentas</li><li>Criar múltiplas contas para manipular rankings</li><li>Assediar, intimidar ou discriminar outros usuários</li><li>Tentar acessar contas ou dados de outros usuários</li><li>Usar bots, scripts ou ferramentas automatizadas</li><li>Interferir no funcionamento da plataforma</li><li>Usar o app para apostas reais ou troca de dinheiro</li></ul>'
      ]},
      { title: '5. Não é Plataforma de Apostas', content: [
        '<div class="legal-highlight">⚠️ <strong>IMPORTANTE:</strong> Podio é exclusivamente um jogo de entretenimento. NÃO é uma plataforma de apostas e NÃO facilita, gerencia, armazena ou transfere dinheiro de nenhum tipo.<br/><br/>O recurso "Bolão do Grupo" é meramente informativo. Podio não tem responsabilidade alguma sobre acordos econômicos entre usuários.<br/><br/>O uso do app para apostas reais fica sob a exclusiva responsabilidade dos usuários e está sujeito às leis aplicáveis em sua jurisdição.</div>'
      ]},
      { title: '6. Propriedade Intelectual', content: [
        'Podio, seu design, código e conteúdo são propriedade do Podio. Nomes, logos e marcas de equipes, competições e pilotos são propriedade de seus respectivos titulares e são usados para fins informativos.',
        'Os dados de resultados de corridas são obtidos de fontes públicas e são de domínio público.'
      ]},
      { title: '7. Conteúdo do Usuário', content: [
        'As previsões e dados que você envia são seu conteúdo. Ao usar o app, você concede ao Podio uma licença não exclusiva para exibir suas previsões aos outros membros dos seus grupos e para gerar estatísticas agregadas.'
      ]},
      { title: '8. Assinaturas Premium (Futuro)', content: [
        '<ul><li>Os preços serão informados claramente antes da compra</li><li>As assinaturas podem ser canceladas a qualquer momento</li><li>Os reembolsos serão tratados de acordo com as políticas da loja de apps correspondente</li><li>As funcionalidades básicas do jogo sempre serão gratuitas</li></ul>'
      ]},
      { title: '9. Disponibilidade do Serviço', content: [
        'Nos esforçamos para manter o app disponível, mas não garantimos um serviço ininterrupto. Reservamo-nos o direito de modificar ou descontinuar o serviço com aviso prévio razoável.'
      ]},
      { title: '10. Limitação de Responsabilidade', content: [
        'Podio é fornecido "como está" sem garantias. Não somos responsáveis por:',
        '<ul><li>Perdas decorrentes do uso do app</li><li>Inexatidão nos resultados das corridas</li><li>Acordos econômicos entre usuários</li><li>Danos decorrentes de interrupções do serviço</li><li>Ações de outros usuários dentro da plataforma</li></ul>'
      ]},
      { title: '11. Exclusão de Conta', content: [
        'Você pode excluir sua conta a qualquer momento em Configurações → Excluir minha conta.',
        '<ul><li>Todos os seus dados pessoais serão excluídos permanentemente</li><li>Suas previsões serão anonimizadas</li><li>Você será removido de todos os seus grupos</li><li>Esta ação é irreversível</li></ul>',
        'Também pode solicitar a exclusão por e-mail em <a href="mailto:privacy@podio.lat">privacy@podio.lat</a>'
      ]},
      { title: '12. Lei Aplicável', content: [
        'Estes termos são regidos pelas leis da República do Paraguai. Qualquer disputa será resolvida nos tribunais competentes de Assunção, Paraguai.'
      ]},
      { title: '13. Contato', content: [
        'E-mail: <a href="mailto:legal@podio.lat">legal@podio.lat</a><br/>Web: <a href="https://podio.lat">podio.lat</a>'
      ]}
    ]
  }
};

export default function TermsOfService() {
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