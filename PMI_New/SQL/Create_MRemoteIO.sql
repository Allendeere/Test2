USE [PMI]
GO

/****** Object:  Table [dbo].[MRemoteIO]    Script Date: 2022/11/13 ¤W¤È 10:46:56 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MRemoteIO](
	[mo_No] [bigint] IDENTITY(1,1) NOT NULL,
	[mo_MaterialNo] [int] NOT NULL,
	[mo_RemoteIONum] [int] NOT NULL,
	[mo_Founder] [nvarchar](50) NULL,
	[mo_CreateDate] [datetime] NULL,
	[mo_Updater] [nvarchar](50) NULL,
	[mo_UpdateDate] [datetime] NULL,
 CONSTRAINT [PK_MRemoteIO] PRIMARY KEY CLUSTERED 
(
	[mo_No] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


