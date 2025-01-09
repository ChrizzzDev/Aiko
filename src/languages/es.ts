import type { AikoDatabase } from '@classes/AikoDatabase';
import { CommandCategory, type PermissionNames } from '@typ/index';
import { slice } from '@lib/functions/functions';
import { ms } from '@utils/Time';
import { capitalize } from 'es-next-tools';
import { Formatter, type PermissionStrings } from 'seyfert';
import { TimestampStyle } from 'seyfert/lib/common';
import type { APIEmbedField } from 'seyfert/lib/types';
import English, { type IBL } from './en';

export default {
	metadata: {
		name: 'Español',
		aliases: ['es'],
		emoji: '🇪🇸',
		translators: ['753158579053264907'],
	},
	commands: {
		dev: {
			blacklist: {
				description: 'Comandos del submódulo en lista negra.',
				create: {
					description: 'Crear una nueva entrada en la lista negra.',
					title: '`✅` - Entrada en la lista negra creada',
					content: async ({
						entity,
						duration,
						reason,
						database,
					}: IBL & { database: AikoDatabase }) => {
						const entityType = (await database.isInBlacklist(entity)).entity;
						return [
							`\`${capitalize(entityType)}\` ha sido añadido a la lista negra.`,
							{
								name: '\`⌛\` » Duración',
								value:
									duration ?
										`${duration} (${Formatter.timestamp(new Date(Date.now() + ms(duration)), TimestampStyle.LongTime)})`
									:	'indeterminado',
							},
							{
								name: '\`❓\` » Motivo',
								value:
									reason ? slice(reason, 100) : 'No se proporcionó motivo.',
							},
						] as string[] & APIEmbedField[];
					},
				},
				delete: 'Eliminar una entrada de la lista negra.',
				list: 'Listar todas las entradas de la lista negra.',
				edit: 'Editar una entrada de la lista negra.',
				options: {
					entity: 'La entidad a poner en la lista negra.',
					'entity-type':
						'El tipo de entidad a poner en la lista negra, ya sea usuario o servidor.',
					reason: 'El motivo para poner en la lista negra la entidad.',
					duration: 'La duración de la lista negra.',
				},
			},
			eval: {
				description: 'Evalúa código JavaScript.',
				invalid: '\`❌\` » Código inválido.',
				error: '\`❌\` » Ocurrió un error al evaluar el código.',
				success: '\`✅\` » Código evaluado con éxito.',
				options: {
					code: 'Código a evaluar.',
					depth: 'Depth.',
				},
			},
		},
		ping: (api: number, bot: number) => {
			return {
				api: `\`📡\` » **Latencia API:** \`${api}ms\``,
				bot: `\`✨\` » **Latencia Bot:** \`${bot}ms\``,
			};
		},

		setlocale: {
			invalid: ({ locale, available }: { locale: string; available: string }) =>
				`\`❌\` » La configuración regional: ${locale} es inválida. Configuraciones disponibles: ${available}`,
			success: ({ locale }: { locale: string }) =>
				`\`✅\` » La configuración regional del gremio se estableció en: ${locale}`,
		},

		help: {
			noCommand: (command: string) =>
				`\`❌\` » Comando ${command} no encontrado.`,
			noCategory: (category: string) =>
				`\`❌\` » Categoría ${category} no encontrada.`,
			title: (clientName: string) => `${clientName} - Menú de Ayuda`,
			aliases: {
				[CommandCategory.General]: 'General',
				[CommandCategory.Fun]: 'Entretenimiento',
				[CommandCategory.Moderation]: 'Moderación',
				[CommandCategory.Utility]: 'Utilidad',
				[CommandCategory.Developer]: 'Desarrollador',
				[CommandCategory.Owner]: 'Propietario',
				[CommandCategory.Music]: 'Música',
				[CommandCategory.Unknown]: 'Desconocido',
				[CommandCategory.Configuration]: 'Configuración',
			} satisfies Record<CommandCategory, string>,
		},
	},
	errors: {
		wrong: '`⚠` » Algo salió mal.',
		blacklist: {
			user: '\`❌\` » Estás en la lista negra para usar el bot.',
			guild: '\`❌\` » Este servidor está en la lista negra para usar el bot.',
			alreadyCreated:
				'\`❌\` » Esta entidad ya está en la lista negra para usar el bot.',
		},

		eval: {
			missingArgs: '`❌` » Intenta escribir algún código...',
		},

		cooldown: {
			user: '\`⌛\` » Estás en tiempo de espera para este comando. Intenta de nuevo en {cooldown}.',
			channel:
				'\`⌛\` » Este comando está en tiempo de espera en este canal. Intenta de nuevo en {cooldown}.',
			global:
				'\`⌛\` » Este comando está en tiempo de espera. Intenta de nuevo en {cooldown}.',
		},

		setlocale: {
			already: (locale: string) =>
				`\`✅\` » La configuración regional ${locale} ya es la configuración regional del gremio.`,
		},

		onlyDev: '\`❌\` » Este comando solo está disponible para desarrolladores.',
		onlyOwner:
			'\`❌\` » Este comando solo está disponible para el propietario del servidor.',
	},
	permissions: {
		list: {
			AddReactions: 'Añadir Reacciones',
			Administrator: 'Administrador',
			AttachFiles: 'Adjuntar Archivos',
			BanMembers: 'Banear Miembros',
			ChangeNickname: 'Cambiar Apodo',
			Connect: 'Conectar',
			CreateInstantInvite: 'Crear Invitaciones',
			CreatePrivateThreads: 'Crear Hilos Privados',
			CreatePublicThreads: 'Crear Hilos Públicos',
			DeafenMembers: 'Silenciar Miembros',
			EmbedLinks: 'Incrustar Enlaces',
			KickMembers: 'Expulsar Miembros',
			ManageChannels: 'Gestionar Canales',
			ManageEvents: 'Gestionar Eventos',
			ManageGuild: 'Gestionar Servidor',
			ManageMessages: 'Gestionar Mensajes',
			ManageNicknames: 'Gestionar Apodos',
			ManageRoles: 'Gestionar Roles',
			ManageThreads: 'Gestionar Hilos',
			ManageWebhooks: 'Gestionar Webhooks',
			MentionEveryone: 'Mencionar a Todos',
			ModerateMembers: 'Moderación de Miembros',
			MoveMembers: 'Mover Miembros',
			MuteMembers: 'Silenciar Miembros',
			PrioritySpeaker: 'Orador Prioritario',
			ReadMessageHistory: 'Leer Historial de Mensajes',
			RequestToSpeak: 'Solicitar Hablar',
			SendMessages: 'Enviar Mensajes',
			SendMessagesInThreads: 'Enviar Mensajes en Hilos',
			SendTTSMessages: 'Enviar Mensajes TTS',
			Speak: 'Hablar',
			Stream: 'Transmitir',
			UseApplicationCommands: 'Usar Comandos de Aplicación',
			UseEmbeddedActivities: 'Usar Actividades',
			UseExternalEmojis: 'Usar Emojis Externos',
			UseExternalStickers: 'Usar Stickers Externos',
			UseVAD: 'Usar VAD',
			ViewAuditLog: 'Ver Registro de Auditoría',
			ViewChannel: 'Ver Canal',
			ViewGuildInsights: 'Ver Información del Servidor',
			ManageGuildExpressions: 'Gestionar Expresiones del Servidor',
			ViewCreatorMonetizationAnalytics:
				'Ver Análisis de Monetización del Creador',
			UseSoundboard: 'Usar Mesa de Sonido',
			UseExternalSounds: 'Usar Sonidos Externos',
			SendVoiceMessages: 'Enviar Mensajes de Voz',
			CreateEvents: 'Crear Eventos',
			CreateGuildExpressions: 'Crear Expresiones del Servidor',
			SendPolls: 'Enviar Encuestas',
			UseExternalApps: 'Usar Aplicaciones Externas',
		} satisfies Record<PermissionNames, string>,

		user: (permissions: PermissionStrings) =>
			`\`❌\` » ¡Hey! No tienes permiso para usar este comando. Necesitas los siguientes permisos: ${permissions}`,
		bot: (permissions: PermissionStrings) =>
			`\`⚠\` » ¡Hey! No tengo permiso para usar este comando. Necesito los siguientes permisos: ${permissions}`,
	},

	SECRET_MESSAGES: [
		'¡Hey! Eso es... secreto.',
		'¡Hey, no puedes ver eso!',
		'No te dejaré ver eso...',
		'...',
		'Te restringiré si sigues haciendo eso.',
		'¡BASTA!',
		'Dadada-dadada-dadada',
	],
} satisfies typeof English;
